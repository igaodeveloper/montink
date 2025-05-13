"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, User, Menu, X, Heart, Bell, ShoppingBag, LogOut, Settings, Home, Tag, Tally1 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useCart } from "@/components/cart-context";
import CartDrawer from "./cart-drawer";
import { Icons } from "./icons";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sample navigation items com links melhorados
  const navItems = [
    { title: "Novidades", href: "#novidades", icon: <Tag className="h-4 w-4" /> },
    { title: "Camisetas", href: "#camisetas", icon: <Tally1 className="h-4 w-4" /> },
    { title: "Moletons", href: "#moletons", icon: <ShoppingBag className="h-4 w-4" /> },
    { title: "Canecas", href: "#canecas", icon: <Icons.cup className="h-4 w-4" /> },
    { title: "Acessórios", href: "#acessorios", icon: <Icons.tshirt className="h-4 w-4" /> },
    { title: "Como Funciona", href: "#como-funciona", icon: <Icons.info className="h-4 w-4" /> },
    { title: "Planos", href: "#planos", icon: <Icons.star className="h-4 w-4" />, highlight: true },
  ];

  const toggleCart = () => {
    // Close other open elements if needed
    if (isSearchOpen) setIsSearchOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isFavoritesOpen) setIsFavoritesOpen(false);
    
    setIsCartOpen(!isCartOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar a funcionalidade de pesquisa
    console.log("Pesquisando por:", searchQuery);
    alert(`Pesquisa por "${searchQuery}" será implementada em breve!`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 shadow-sm backdrop-blur-lg"
            : "bg-background"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo com animação */}
          <Link
            href="/"
            className="flex items-center group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Icons.logo className="h-8 w-8 mr-2 transition-transform group-hover:scale-110" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-primary"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              Montink
            </motion.span>
            <motion.span 
              className="ml-1 text-xs font-normal text-muted-foreground"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              STORE
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="mx-4 hidden flex-1 justify-center lg:flex">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`text-sm transition-colors hover:text-primary flex items-center gap-1.5 ${
                      item.highlight
                        ? "font-medium text-primary"
                        : "text-foreground"
                    }`}
                  >
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5"
                    >
                      {item.icon}
                      {item.title}
                    </motion.span>
                    {item.highlight && (
                      <motion.span 
                        className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-primary"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 2
                        }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1.5">
            {/* Search Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground relative overflow-hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Pesquisar"
              >
                <Search className="h-5 w-5" />
                <motion.span 
                  className="absolute inset-0 rounded-full bg-primary/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>

            {/* Account Button with Dropdown */}
            <DropdownMenu>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground relative overflow-hidden"
                    aria-label="Minha conta"
                  >
                    <User className="h-5 w-5" />
                    <motion.span 
                      className="absolute inset-0 rounded-full bg-primary/10"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </DropdownMenuTrigger>
              </motion.div>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Home className="h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Meus Pedidos</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Lista de Desejos</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notificações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground relative overflow-hidden"
                aria-label="Favoritos"
                onClick={() => {
                  alert("Lista de favoritos será implementada em breve!");
                  setIsFavoritesOpen(!isFavoritesOpen);
                }}
              >
                <Heart className="h-5 w-5" />
                <motion.span 
                  className="absolute inset-0 rounded-full bg-primary/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>

            {/* Cart Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground overflow-hidden"
                aria-label="Carrinho"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                <motion.span 
                  className="absolute inset-0 rounded-full bg-primary/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {itemsCount > 0 && (
                  <motion.span 
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {itemsCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {/* Theme Switcher - Desktop */}
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 text-foreground lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b bg-background"
            >
              <div className="container py-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="O que você está procurando?"
                    className="w-full pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b bg-background lg:hidden"
            >
              <nav className="container py-4">
                <ul className="flex flex-col space-y-4">
                  {navItems.map((item, index) => (
                    <motion.li 
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 text-sm transition-colors hover:text-primary ${
                          item.highlight
                            ? "font-medium text-primary"
                            : "text-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        {item.title}
                        {item.highlight && (
                          <motion.span 
                            className="ml-1 inline-flex h-2 w-2 rounded-full bg-primary"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.8, 1]
                            }}
                            transition={{ 
                              repeat: Infinity,
                              duration: 2
                            }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
} 