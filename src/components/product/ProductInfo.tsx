"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart, Heart, Share2, Star, Award, CheckCircle2, AlertTriangle, RulerIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart-context";

// Create a context for sharing the selected color with other components
interface ProductColorContextType {
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}

export const ProductColorContext = createContext<ProductColorContextType>({
  selectedColor: null,
  setSelectedColor: () => {},
});

export const useProductColor = () => useContext(ProductColorContext);

interface ProductInfoProps {
  title?: string;
  price?: number;
  variants?: {
    size?: string[];
    color?: string[];
  };
  className?: string;
  rating?: number;
  reviewCount?: number;
}

const ProductInfo = ({
  title = "Tênis Esportivo XYZ",
  price = 299.9,
  variants = {
    size: ["37", "38", "39", "40", "41", "42"],
    color: ["Preto", "Branco", "Azul"],
  },
  className,
  rating = 4.8,
  reviewCount = 124,
}: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addItem } = useCart();

  // Load selections from localStorage if available and less than 15 minutes old
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("productSelections");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const timestamp = parsedData.timestamp || 0;
        const fifteenMinutesInMs = 15 * 60 * 1000;

        if (Date.now() - timestamp < fifteenMinutesInMs) {
          if (parsedData.selectedSize) setSelectedSize(parsedData.selectedSize);
          if (parsedData.selectedColor)
            setSelectedColor(parsedData.selectedColor);
          if (parsedData.quantity) setQuantity(parsedData.quantity);
          if (parsedData.isFavorite !== undefined)
            setIsFavorite(parsedData.isFavorite);
        }
      }
    } catch (error) {
      console.error(
        "Error loading product selections from localStorage:",
        error,
      );
    }
  }, []);

  // Save selections to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("productSelections");
    const parsedData = savedData ? JSON.parse(savedData) : {};

    localStorage.setItem(
      "productSelections",
      JSON.stringify({
        ...parsedData,
        selectedSize,
        selectedColor,
        quantity,
        isFavorite,
        timestamp: Date.now(),
      }),
    );
  }, [selectedSize, selectedColor, quantity, isFavorite]);

  // Format price to Brazilian Real
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Handle add to cart with animation
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      // Provide visual feedback that selections are required
      return;
    }

    setAddedToCart(true);
    // Vibrate if available (mobile devices)
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    // Add to cart using context
    addItem({
      id: Math.random().toString(36).substring(2, 9), // Generate a simple random ID
      title,
      price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: (document.querySelector('.product-gallery img') as HTMLImageElement)?.src,
    });

    // Simulate adding to cart
    console.log("Adding to cart:", {
      product: title,
      price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // When color is selected, update both local state and context
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    
    // Vibrate if available (mobile devices) for tactile feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Map color names to color values for visualization
  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      Preto: "#000000",
      Branco: "#FFFFFF",
      Azul: "#0066FF",
      Vermelho: "#FF0000",
      Verde: "#00A651",
      Amarelo: "#FFCC00",
      Roxo: "#8A2BE2",
      Cinza: "#919191",
    };
    
    return colorMap[colorName] || "#CCCCCC";
  };

  return (
    <ProductColorContext.Provider value={{ selectedColor, setSelectedColor }}>
      <motion.div
        className={cn(
          "flex flex-col gap-6",
          className,
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div>
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {title}
            </motion.h1>
            <motion.button
              onClick={() => setIsFavorite(!isFavorite)}
              className="rounded-full p-2 transition-all hover:bg-muted"
              aria-label={
                isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              whileTap={{ scale: 0.85 }}
              animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-all",
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground",
                )}
              />
            </motion.button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted",
                      i === Math.floor(rating) && rating % 1 > 0
                        ? "fill-yellow-400/50 text-yellow-400"
                        : "",
                    )}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} avaliações)
            </span>
          </div>

          <motion.div 
            className="mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(price * 1.2)}
            </span>
            <p className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {formatPrice(price)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Em até 12x sem juros</span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
                20% OFF
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Produto original com garantia de 1 ano</span>
          </motion.div>
        </div>

        {variants.size && variants.size.length > 0 && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tamanho</h3>
              {!selectedSize && (
                <motion.span 
                  className="text-xs text-destructive flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    repeat: 3, 
                    repeatType: "reverse", 
                    duration: 0.5 
                  }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Selecione um tamanho</span>
                </motion.span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.size.map((size, index) => (
                <motion.button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "relative overflow-hidden flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-all",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    !selectedSize && "animate-pulse",
                  )}
                  aria-label={`Select size ${size}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {size}
                  {selectedSize === size && (
                    <motion.div
                      className="absolute inset-0 bg-primary/10"
                      layoutId="selectedSize"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground">
              <button 
                onClick={() => window.open("#guia-tamanhos", "_blank")}
                className="flex items-center gap-1 hover:text-primary"
              >
                <RulerIcon className="h-3 w-3" />
                <span className="hover:underline">Guia de tamanhos</span>
              </button>
            </div>
          </motion.div>
        )}

        {variants.color && variants.color.length > 0 && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Cor</h3>
              {!selectedColor && (
                <motion.span 
                  className="text-xs text-destructive flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    repeat: 3, 
                    repeatType: "reverse", 
                    duration: 0.5 
                  }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Selecione uma cor</span>
                </motion.span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {variants.color.map((color, index) => {
                // Use our helper to get the color value
                const colorValue = getColorValue(color);

                return (
                  <motion.button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                      "group relative flex h-9 items-center justify-center rounded-full border p-1 transition-all",
                      selectedColor === color
                        ? "ring-2 ring-primary ring-offset-2"
                        : "hover:ring-1 hover:ring-primary hover:ring-offset-1",
                      !selectedColor && "animate-pulse",
                    )}
                    title={color}
                    aria-label={`Select color ${color}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span
                      className={cn(
                        "h-6 w-6 rounded-full",
                      )}
                      style={{ backgroundColor: colorValue }}
                    />
                    {selectedColor === color ? (
                      <motion.span 
                        className="absolute -bottom-6 text-xs font-medium"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {color}
                      </motion.span>
                    ) : (
                      <motion.span 
                        className="absolute -bottom-6 text-xs font-medium opacity-0 group-hover:opacity-100"
                        initial={{ opacity: 0, y: -5 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {color}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border overflow-hidden">
              <motion.button
                onClick={decreaseQuantity}
                className="flex h-10 w-10 items-center justify-center border-r text-lg"
                disabled={quantity <= 1}
                aria-label="Diminuir quantidade"
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.95 }}
              >
                -
              </motion.button>
              <span className="flex h-10 w-10 items-center justify-center text-sm font-medium">
                {quantity}
              </span>
              <motion.button
                onClick={increaseQuantity}
                className="flex h-10 w-10 items-center justify-center border-l text-lg"
                aria-label="Aumentar quantidade"
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.95 }}
              >
                +
              </motion.button>
            </div>
            <span className="text-sm text-muted-foreground">
              {quantity > 1 && `Total: ${formatPrice(price * quantity)}`}
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="mt-4 flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button
            size="lg"
            className={cn(
              "relative flex-1 gap-2 transition-all overflow-hidden bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90",
              addedToCart && "bg-green-600 hover:bg-green-700",
              !selectedSize || !selectedColor ? "opacity-80" : "",
            )}
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor || addedToCart}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Adicionado!</span>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="relative z-10">Adicionar ao Carrinho</span>
                  {!(!selectedSize || !selectedColor) && (
                    <motion.span 
                      className="absolute bottom-0 left-0 h-1 bg-white/30"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    ></motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" className="aspect-square p-0">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Compartilhar</span>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-2 flex flex-col gap-2 rounded-lg border bg-card/50 p-3 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-primary" />
            <span>Compra 100% segura</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Frete grátis para compras acima de R$ 299,90</span>
          </div>
        </motion.div>
      </motion.div>
    </ProductColorContext.Provider>
  );
};

export default ProductInfo;
