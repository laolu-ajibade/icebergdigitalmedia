"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Trash2, ShoppingBag, Send, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const pathname = usePathname();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    generateWhatsAppUrl,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen || pathname?.startsWith("/admin")) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("Please provide your name and WhatsApp phone number.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // 1. Record the order in our system
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryAddress,
          notes: orderNotes,
          items,
          totalAmount,
        }),
      });

      // 2. Build WhatsApp URL and redirect
      const waUrl = generateWhatsAppUrl(customerName, customerPhone, deliveryAddress);
      window.open(waUrl, "_blank");

      // 3. Clear cart and close drawer
      clearCart();
      setIsCartOpen(false);
    } catch {
      // Fallback: still open WhatsApp directly
      const waUrl = generateWhatsAppUrl(customerName, customerPhone, deliveryAddress);
      window.open(waUrl, "_blank");
      clearCart();
      setIsCartOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card shadow-elevation border-l border-border flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-ink">
                Your Print Order Cart
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-button text-ink-muted hover:text-ink hover:bg-canvas-muted transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-card bg-canvas-muted mx-auto flex items-center justify-center text-ink-muted">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-display font-semibold text-ink text-base">
                  Your cart is currently empty
                </h3>
                <p className="text-xs text-ink-muted max-w-xs mx-auto">
                  Browse our commercial categories or use the Instant Estimator to configure custom prints with volume discounts.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors"
                >
                  <span>Explore Print Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-theme bg-canvas-soft border border-border/80 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {item.image && (
                      <div className="relative w-14 h-14 rounded-theme overflow-hidden bg-white shrink-0 border border-border/50">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-sm text-ink truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-ink-muted">{item.category}</p>
                      <div className="text-[11px] text-ink-body mt-1 space-y-0.5">
                        {item.paperStock && (
                          <p>
                            <span className="font-medium text-ink">Stock:</span> {item.paperStock}
                          </p>
                        )}
                        {item.finish && (
                          <p>
                            <span className="font-medium text-ink">Finish:</span> {item.finish}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-ink-muted hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-muted">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 px-2 py-1 bg-white border border-border rounded-button text-ink text-center font-semibold"
                      />
                    </div>
                    <div className="font-display font-bold text-sm text-ink">
                      ₦{item.totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Form & WhatsApp Route Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-canvas-soft space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-ink-body">Estimated Total</span>
                <span className="font-display font-black text-2xl text-ink">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>

              <form onSubmit={handleCheckout} className="space-y-3">
                {errorMsg && (
                  <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
                )}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Your Name / Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adeola Johnson (Apex Studio)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-button bg-white border border-border text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-button bg-white border border-border text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Delivery Address / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ikeja, Lagos (or State for courier dispatch)"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-button bg-white border border-border text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Artwork Instructions / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. I have ready PDF with 3mm bleed"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-button bg-white border border-border text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-button bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-soft cursor-pointer mt-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? "Routing Order..." : "Send Order to WhatsApp"}
                  </span>
                </button>
                <p className="text-[11px] text-ink-muted text-center">
                  Direct dispatch to Iceberg Studio WhatsApp desk with itemized proofing specs.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
