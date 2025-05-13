"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Truck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, itemsCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [checkoutClicked, setCheckoutClicked] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Calculate total price
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Format price to Brazilian Real
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset checkout state when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCheckoutClicked(false);
        setProcessingCheckout(false);
      }, 300);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const handleIncrementQuantity = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);

    // Vibrate if available (mobile devices)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDecrementQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      removeItem(id);
    }

    // Vibrate if available (mobile devices)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleCheckout = () => {
    setCheckoutClicked(true);
    setProcessingCheckout(true);

    // Vibrate if available (mobile devices)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Simular processamento
    setTimeout(() => {
      setProcessingCheckout(false);
      alert(
        "Checkout simulado com sucesso! Em um ambiente real, você seria redirecionado para a página de pagamento.",
      );
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l bg-card shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </motion.div>
                <h2 className="text-lg font-medium">Seu Carrinho</h2>
                <motion.span
                  className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {itemsCount} {itemsCount === 1 ? "item" : "itens"}
                </motion.span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Fechar carrinho"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="h-[calc(100vh-12rem)] overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
                  </motion.div>
                  <motion.p
                    className="mt-4 text-center text-muted-foreground"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Seu carrinho está vazio.
                  </motion.p>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      className="mt-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                      onClick={onClose}
                    >
                      Continuar Comprando
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item, index) => (
                    <motion.li
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 rounded-lg border p-3 hover:border-primary/20 transition-colors"
                    >
                      {/* Item Image */}
                      <motion.div
                        className="relative h-20 w-20 overflow-hidden rounded-md bg-muted"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <ShoppingCart className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                        )}
                      </motion.div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {item.size && (
                            <span className="rounded-full bg-secondary px-2 py-0.5">
                              Tamanho: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="rounded-full bg-secondary px-2 py-0.5">
                              Cor: {item.color}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-md border overflow-hidden">
                            <motion.button
                              onClick={() =>
                                handleDecrementQuantity(item.id, item.quantity)
                              }
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-muted"
                              aria-label="Diminuir quantidade"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>
                            <span className="flex h-7 w-7 items-center justify-center text-xs">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() =>
                                handleIncrementQuantity(item.id, item.quantity)
                              }
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-muted"
                              aria-label="Aumentar quantidade"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} cada
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => removeItem(item.id)}
                        className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
                        aria-label="Remover item"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 border-t bg-card p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Truck className="h-3.5 w-3.5" />
                      Entrega
                    </span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <motion.div
                    className="flex items-center justify-between border-t pt-2"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      repeatType: "reverse",
                    }}
                  >
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </motion.div>
                </div>
                <motion.div
                  className="mt-4 relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-blue-600 gap-2 h-12"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={checkoutClicked}
                  >
                    <AnimatePresence mode="wait">
                      {processingCheckout ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div
                            className="h-4 w-4 rounded-full border-2 border-t-transparent border-white"
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              ease: "linear",
                            }}
                          />
                          <span>Processando...</span>
                        </motion.div>
                      ) : checkoutClicked ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Pedido Finalizado!</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <CreditCard className="h-5 w-5" />
                          <span>Finalizar Compra</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.span
                      className="absolute bottom-0 left-0 h-1 bg-white/30"
                      initial={{ width: 0 }}
                      animate={{ width: processingCheckout ? "100%" : "0%" }}
                      transition={
                        processingCheckout ? { duration: 1.5 } : { duration: 0 }
                      }
                    />
                  </Button>
                </motion.div>
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Compra 100% segura. Aceitamos todos os cartões e boleto.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
