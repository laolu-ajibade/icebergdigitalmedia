"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paperStock?: string;
  finish?: string;
  customNotes?: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "totalPrice">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  generateWhatsAppUrl: (customerName: string, customerPhone: string, deliveryAddress: string, routingNumber?: string) => string;
}

const globalForCart = globalThis as unknown as {
  __icebergCartContext?: React.Context<CartContextType | undefined>;
};

const CartContext =
  globalForCart.__icebergCartContext ??
  (globalForCart.__icebergCartContext = createContext<CartContextType | undefined>(undefined));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("iceberg-cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      localStorage.setItem("iceberg-cart", JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, "id" | "totalPrice">) => {
    const id = `${item.productId}-${item.paperStock || ""}-${item.finish || ""}-${Date.now()}`;
    const totalPrice = item.unitPrice * item.quantity;
    setItems((prev) => [...prev, { ...item, id, totalPrice }]);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateWhatsAppUrl = (
    customerName: string,
    customerPhone: string,
    deliveryAddress: string,
    routingNumber = WHATSAPP_NUMBER
  ) => {
    const cleanNumber = routingNumber.replace(/[^0-9]/g, "");
    
    let message = `*NEW ORDER - ICEBERG CREATIVE PRINT STUDIO*\n\n`;
    message += `👤 *Client Name:* ${customerName}\n`;
    message += `📞 *Phone:* ${customerPhone}\n`;
    if (deliveryAddress) {
      message += `📍 *Delivery Address:* ${deliveryAddress}\n`;
    }
    message += `\n*ITEMIZED SPECIFICATIONS:*\n`;

    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.title}*\n`;
      message += `   • Quantity: ${item.quantity.toLocaleString()} pcs\n`;
      if (item.paperStock) message += `   • Material/Stock: ${item.paperStock}\n`;
      if (item.finish) message += `   • Finish: ${item.finish}\n`;
      if (item.customNotes) message += `   • Notes: ${item.customNotes}\n`;
      message += `   • Subtotal: ₦${item.totalPrice.toLocaleString()}\n`;
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL ESTIMATE:* ₦${totalAmount.toLocaleString()}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `Hello Iceberg Studio team, I would like to confirm my order and send artwork proofs for production.`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
        generateWhatsAppUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
