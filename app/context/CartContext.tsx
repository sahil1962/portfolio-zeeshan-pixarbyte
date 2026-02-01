'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

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

const CART_STORAGE_KEY = 'notes-cart';

// Helper function to load cart from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []; // SSR safety

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsedCart = JSON.parse(stored);
      // Validate cart data structure
      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    // Clear corrupted data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const initialLoadDone = useRef(false);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      const storedCart = loadCartFromStorage();
      if (storedCart.length > 0) {
        // Use callback to update state from external system (localStorage)
        requestAnimationFrame(() => {
          setCart(storedCart);
        });
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!initialLoadDone.current) return;

    try {
      if (cart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      // Handle quota exceeded or other localStorage errors
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Cart will not persist.');
      }
    }
  }, [cart]);

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
