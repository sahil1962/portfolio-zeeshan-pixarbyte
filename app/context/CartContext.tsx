'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Note {
  id: string;
  title: string;
  description: string;
  topics: string[];
  pages: number;
  price: number;
  preview: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Note {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (note: Note) => void;
  removeFromCart: (noteId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (noteId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (note: Note) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === note.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === note.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...note, quantity: 1 }];
    });
  };

  const removeFromCart = (noteId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== noteId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (noteId: string) => {
    return cart.some((item) => item.id === noteId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
