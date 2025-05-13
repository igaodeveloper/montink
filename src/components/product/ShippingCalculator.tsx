"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Truck, MapPin, Calendar, Package, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ShippingCalculatorProps {
  className?: string;
}

interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
  icon: React.ReactNode;
}

// Define distribution centers
const distributionCenters = [
  { city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333 },
  { city: "Belo Horizonte", state: "MG", lat: -19.9167, lng: -43.9345 },
  { city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729 },
];

// City coordinates for more accurate distance calculation
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "São Paulo": { lat: -23.5505, lng: -46.6333 },
  "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
  "Belo Horizonte": { lat: -19.9167, lng: -43.9345 },
  "Brasília": { lat: -15.7801, lng: -47.9292 },
  "Salvador": { lat: -12.9714, lng: -38.5014 },
  "Fortaleza": { lat: -3.7319, lng: -38.5267 },
  "Recife": { lat: -8.0579, lng: -34.8829 },
  "Porto Alegre": { lat: -30.0330, lng: -51.2300 },
  "Curitiba": { lat: -25.4290, lng: -49.2671 },
  "Manaus": { lat: -3.1190, lng: -60.0217 },
  "Belém": { lat: -1.4558, lng: -48.4902 },
  "Goiânia": { lat: -16.6799, lng: -49.2550 },
  "Florianópolis": { lat: -27.5969, lng: -48.5495 },
};

const ShippingCalculator = ({ className }: ShippingCalculatorProps) => {
  const [cep, setCep] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentlyCalculated, setRecentlyCalculated] = useState(false);
  
  // Lista de CEPs recentes
  const [recentCeps, setRecentCeps] = useState<string[]>([]);

  // Load CEP from localStorage if available and less than 15 minutes old
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("productSelections");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const timestamp = parsedData.timestamp || 0;
        const fifteenMinutesInMs = 15 * 60 * 1000;

        if (Date.now() - timestamp < fifteenMinutesInMs) {
          if (parsedData.cep) setCep(parsedData.cep);
          if (parsedData.addressData) setAddressData(parsedData.addressData);
          if (parsedData.shippingCost !== undefined)
            setShippingCost(parsedData.shippingCost);
          if (parsedData.selectedShipping)
            setSelectedShipping(parsedData.selectedShipping);
          if (parsedData.recentCeps)
            setRecentCeps(parsedData.recentCeps);

          // If we have address data, always regenerate shipping options with icons
          if (parsedData.addressData) {
            const cost = calculateShippingCost(parsedData.addressData.uf, parsedData.addressData.localidade);
            generateShippingOptions(cost);
          }
          // We don't restore shipping options from localStorage as they contain React elements
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      // Clear invalid data
      localStorage.removeItem("productSelections");
    }
  }, []);

  // Format CEP input (12345-678)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setCep(value);

    // Clear error when user starts typing again
    if (error) setError(null);
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Find nearest distribution center and calculate shipping cost
  const calculateShippingCost = (uf: string, city: string): number => {
    // Check if we have the exact city coordinates
    let cityLat = 0;
    let cityLng = 0;
    
    if (cityCoordinates[city]) {
      cityLat = cityCoordinates[city].lat;
      cityLng = cityCoordinates[city].lng;
    } else {
      // Brazilian regions - fallback if we don't have exact coordinates
      const southeast = ["SP", "RJ", "MG", "ES"];
      const south = ["PR", "SC", "RS"];
      const midwest = ["MT", "MS", "GO", "DF"];
      const northeast = ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"];
      const north = ["AM", "PA", "AC", "RO", "RR", "AP", "TO"];

      if (southeast.includes(uf)) return 15.0;
      if (south.includes(uf) || midwest.includes(uf)) return 20.0;
      if (northeast.includes(uf)) return 25.0;
      if (north.includes(uf)) return 30.0;
      return 35.0; // Default for unknown regions
    }

    // Find the nearest distribution center
    let nearestDistance = Infinity;
    for (const center of distributionCenters) {
      const distance = calculateDistance(
        cityLat, 
        cityLng, 
        center.lat, 
        center.lng
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
      }
    }

    // Calculate shipping cost based on distance
    const baseCost = 10; // Base cost in BRL
    let distanceCost = 0;
    
    if (nearestDistance < 100) {
      distanceCost = 5;
    } else if (nearestDistance < 300) {
      distanceCost = 10;
    } else if (nearestDistance < 600) {
      distanceCost = 20;
    } else if (nearestDistance < 1000) {
      distanceCost = 30;
    } else if (nearestDistance < 2000) {
      distanceCost = 40;
    } else {
      distanceCost = 50;
    }

    // Special cities might have different costs (e.g., capital cities)
    const capitalCities = [
      "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", 
      "Salvador", "Fortaleza", "Recife", "Porto Alegre", "Curitiba", 
      "Manaus", "Belém", "Goiânia", "Florianópolis"
    ];
    
    const discount = capitalCities.includes(city) ? 5 : 0;
    
    return Math.max(baseCost + distanceCost - discount, baseCost);
  };

  // Generate shipping options based on base cost
  const generateShippingOptions = (baseCost: number) => {
    // Add estimated delivery time based on distance
    let standardDays, expressDays, sameDayAvailable;
    
    if (baseCost <= 15) { // Very close
      standardDays = "2-3 dias úteis";
      expressDays = "1 dia útil";
      sameDayAvailable = true;
    } else if (baseCost <= 25) { // Medium distance
      standardDays = "3-5 dias úteis";
      expressDays = "2 dias úteis";
      sameDayAvailable = false;
    } else { // Far away
      standardDays = "5-8 dias úteis";
      expressDays = "3-4 dias úteis";
      sameDayAvailable = false;
    }

    const options: ShippingOption[] = [
      {
        id: "standard",
        name: "Padrão",
        price: baseCost,
        days: standardDays,
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Truck className="h-4 w-4 text-primary" />
          </div>
        ),
      },
      {
        id: "express",
        name: "Expressa",
        price: baseCost * 2,
        days: expressDays,
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Truck className="h-4 w-4 text-blue-500" />
            </motion.div>
          </div>
        ),
      },
    ];

    if (sameDayAvailable) {
      options.push({
        id: "same_day",
        name: "Hoje",
        price: baseCost * 3,
        days: "Hoje, se pedido até 12h",
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Truck className="h-4 w-4 text-green-500" />
            </motion.div>
          </div>
        ),
      });
    }

    options.push({
      id: "free",
      name: "Grátis",
      price: 0,
      days: "7-10 dias úteis",
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Package className="h-4 w-4 text-amber-500" />
          </motion.div>
        </div>
      ),
    });

    setShippingOptions(options);
    
    // Automatically select standard shipping
    setSelectedShipping("standard");
  };

  // Format price as BRL
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Handle shipping option selection
  const handleShippingSelection = (id: string) => {
    setSelectedShipping(id);
    
    // Vibrate on selection for tactile feedback (mobile)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Save selection to localStorage
    const savedData = localStorage.getItem("productSelections");
    const parsedData = savedData ? JSON.parse(savedData) : {};

    localStorage.setItem(
      "productSelections",
      JSON.stringify({
        ...parsedData,
        selectedShipping: id,
        timestamp: Date.now(),
      })
    );
  };

  // Add to recent CEPs list
  const addToRecentCeps = (newCep: string) => {
    // Check if CEP is already in the list
    if (!recentCeps.includes(newCep)) {
      // Add to the beginning of the array and keep only the last 3
      const updatedCeps = [newCep, ...recentCeps].slice(0, 3);
      setRecentCeps(updatedCeps);
      
      // Save to localStorage
      const savedData = localStorage.getItem("productSelections");
      const parsedData = savedData ? JSON.parse(savedData) : {};
      
      localStorage.setItem(
        "productSelections",
        JSON.stringify({
          ...parsedData,
          recentCeps: updatedCeps,
          timestamp: Date.now(),
        })
      );
    }
  };

  // Fetch address data from CEP
  const fetchAddressData = async () => {
    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      setError("Digite um CEP válido");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formattedCep = cep.replace(/\D/g, "");
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado");
        setAddressData(null);
        setShippingCost(null);
        setSelectedShipping(null);
        setShippingOptions([]);
      } else {
        setAddressData(data);
        const cost = calculateShippingCost(data.uf, data.localidade);
        setShippingCost(cost);
        generateShippingOptions(cost);
        
        // Add to recent CEPs
        addToRecentCeps(cep);
        
        // Animação indicando cálculo recente
        setRecentlyCalculated(true);
        setTimeout(() => setRecentlyCalculated(false), 3000);

        // Save data to localStorage
        const savedData = localStorage.getItem("productSelections");
        const parsedData = savedData ? JSON.parse(savedData) : {};

        localStorage.setItem(
          "productSelections",
          JSON.stringify({
            ...parsedData,
            cep,
            addressData: data,
            shippingCost: cost,
            recentCeps: [cep, ...(parsedData.recentCeps || [])].slice(0, 3),
            timestamp: Date.now(),
          })
        );
      }
    } catch (error) {
      console.error("Error fetching CEP data:", error);
      setError("Falha ao buscar o CEP. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Enter" key on CEP input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchAddressData();
    }
  };
  
  // Select a recent CEP
  const handleSelectRecentCep = (selectedCep: string) => {
    setCep(selectedCep);
    // Buscar CEP automaticamente
    setTimeout(() => {
      fetchAddressData();
    }, 100);
  };

  return (
    <motion.div 
      className={cn(
        "rounded-xl border bg-card/80 p-5 shadow-sm backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Truck className="h-5 w-5 text-primary" />
        </motion.div>
        <h2 className="text-lg font-medium">Calcular Frete e Prazo</h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Digite seu CEP"
              value={cep}
              onChange={handleCepChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              className={cn(
                "pl-9 pr-20",
                error ? "border-destructive" : ""
              )}
              maxLength={9}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={fetchAddressData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Loader2 className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MapPin className="h-4 w-4" />
                  </motion.div>
                )}
              </Button>
            </div>
            
            <AnimatePresence>
              {isInputFocused && recentCeps.length > 0 && (
                <motion.div 
                  className="absolute left-0 right-0 top-full mt-1 rounded-md border bg-card shadow-md z-10"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <div className="p-1 text-xs text-muted-foreground">
                    CEPs recentes:
                  </div>
                  {recentCeps.map((recentCep) => (
                    <motion.button
                      key={recentCep}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => handleSelectRecentCep(recentCep)}
                      whileHover={{ x: 5 }}
                    >
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {recentCep}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => window.open("https://buscacepinter.correios.com.br/app/endereco/index.php", "_blank")}
            >
              Não sei meu CEP
            </button>
            <button
              type="button"
              className="relative text-xs text-muted-foreground hover:text-foreground"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="flex items-center">
                <Info className="h-3 w-3" />
                <span className="ml-1">Informações de entrega</span>
              </div>
              
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    className="absolute -right-4 -top-20 w-64 rounded-md bg-popover p-3 text-left shadow-md z-20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <p className="text-xs text-muted-foreground">
                      Entregamos para todo o Brasil. O prazo pode variar de acordo com a sua localização. Produtos personalizados podem adicionar 1-2 dias úteis ao prazo estimado.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {error && (
            <motion.div
              className="mt-2 flex items-center gap-1.5 text-sm text-destructive"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {addressData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div 
                className={cn(
                  "rounded-lg border bg-muted/50 p-3",
                  recentlyCalculated ? "border-primary/50" : ""
                )}
                animate={recentlyCalculated ? { 
                  boxShadow: ["0 0 0 rgba(0, 0, 0, 0)", "0 0 8px rgba(0, 120, 255, 0.5)", "0 0 0 rgba(0, 0, 0, 0)"] 
                } : {}}
                transition={{ duration: 1.5 }}
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">
                    Endereço encontrado
                  </span>
                </div>
                <p className="text-sm">
                  {addressData.logradouro}{" "}
                  {addressData.bairro && ` - ${addressData.bairro}`}
                </p>
                <p className="text-sm">
                  {addressData.localidade} - {addressData.uf}, {addressData.cep}
                </p>
              </motion.div>

              <div className="mt-4">
                <span className="text-sm font-medium">Opções de Envio:</span>
                <div className="mt-2 space-y-2">
                  {shippingOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                        selectedShipping === option.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => handleShippingSelection(option.id)}
                    >
                      <div className="mt-0.5">{option.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option.name}</span>
                          <span className={cn(
                            option.price === 0 ? "text-green-600 font-medium" : ""
                          )}>
                            {option.price === 0
                              ? "Grátis"
                              : formatPrice(option.price)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{option.days}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!addressData && (
          <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
            </motion.div>
            <p className="text-sm">
              Digite seu CEP para calcular o frete e prazo de entrega
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShippingCalculator;
