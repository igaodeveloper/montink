"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemsCount, setItemsCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        
        // Calculate total items
        const count = parsedCart.reduce(
          (total: number, item: CartItem) => total + item.quantity,
          0
        );
        setItemsCount(count);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
      
      // Update total count
      const count = items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setItemsCount(count);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart (same id, size and color)
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.id === newItem.id && 
          item.size === newItem.size && 
          item.color === newItem.color
      );

      // If item exists, update quantity
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }

      // Otherwise add new item
      return [...prevItems, newItem];
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 