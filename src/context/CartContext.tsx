import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, TransformerConfig } from '@/types/transformer';
import { calculateTransformerPrice } from '@/utils/pricing';

interface CartContextType {
  items: CartItem[];
  addToCart: (config: TransformerConfig) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('aeb-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('aeb-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((config: TransformerConfig) => {
    const basePrice = calculateTransformerPrice(config, false);
    const finalPrice = calculateTransformerPrice(config, true);
    
    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      config,
      quantity: 1,
      basePrice,
      finalPrice
    };

    setItems(prev => [...prev, newItem]);
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('aeb-cart');
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};