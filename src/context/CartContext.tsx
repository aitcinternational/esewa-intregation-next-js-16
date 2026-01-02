
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/products';

export interface CartItem extends Product {
    quantity: number;
    selectedColor?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number, color?: string) => void;
    removeFromCart: (productId: string, color?: string) => void;
    updateQuantity: (productId: string, quantity: number, color?: string) => void;
    clearCart: () => void;
    cartTotal: number;
    itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // ... (useEffect for load/save remains same)

    const addToCart = (product: Product, quantity: number = 1, color?: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id && item.selectedColor === color);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id && item.selectedColor === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, selectedColor: color }];
        });
    };

    const removeFromCart = (productId: string, color?: string) => {
        setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedColor === color)));
    };

    const updateQuantity = (productId: string, quantity: number, color?: string) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId && item.selectedColor === color ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemsCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemsCount }}
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
