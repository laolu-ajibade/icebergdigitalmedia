"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Send, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getWhatsAppLink } from "@/lib/constants";

export default function CategoryDedicatedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [category, setCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    // 1. Fetch Categories to find current category metadata
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          const found = data.categories.find((c: any) => c.slug === slug);
          setCategory(found || { name: slug.replace(/-/g, " "), slug, description: "Commercial printing services" });
        }
      })
      .catch(() => {});

    // 2. Fetch products for this category
    fetch(`/api/products?category=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});
  }, [slug]);

  const openConfigure = (prod: any) => {
    setSelectedProduct(prod);
    setSelectedTierIdx(0);
    setSelectedFinish(prod.finishes?.[0] || "");
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const tier = selectedProduct.quantityTiers?.[selectedTierIdx] || {
      quantity: selectedProduct.minQuantity,
      totalPrice: selectedProduct.basePrice,
      pricePerUnit: Math.round(selectedProduct.basePrice / selectedProduct.minQuantity),
    };

    addItem({
      productId: selectedProduct.slug,
      title: selectedProduct.title,
      category: selectedProduct.categoryName,
      quantity: tier.quantity,
      unitPrice: tier.pricePerUnit,
      paperStock: selectedProduct.paperStocks?.[0] || "",
      finish: selectedFinish,
      image: selectedProduct.image,
    });

    setSelectedProduct(null);
  };

  const handleWhatsApp = () => {
    if (!selectedProduct) return;
    const tier = selectedProduct.quantityTiers?.[selectedTierIdx] || {
      quantity: selectedProduct.minQuantity,
      totalPrice: selectedProduct.basePrice,
    };

    let msg = `*CATEGORY ORDER INQUIRY - ICEBERG STUDIO*\n\n`;
    msg += `📦 *Product:* ${selectedProduct.title}\n`;
    msg += `📁 *Category:* ${selectedProduct.categoryName}\n`;
    msg += `🔢 *Quantity:* ${tier.quantity.toLocaleString()} pcs\n`;
    msg += `✨ *Finish:* ${selectedFinish}\n`;
    msg += `💰 *Total:* ₦${tier.totalPrice.toLocaleString()}\n\n`;
    msg += `Hello Iceberg Studio team, I am on your category page and would like to confirm my order specifications!`;

    window.open(getWhatsAppLink(msg), "_blank");
    setSelectedProduct(null);
  };

  return (
    <div className="py-12 md:py-20 bg-canvas-soft min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold capitalize">
            {category?.name || slug}
          </span>
        </div>

        {/* Category Header Banner */}
        <div className="bg-card rounded-card border border-border/80 p-8 md:p-10 shadow-soft mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Categories</span>
            </Link>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight capitalize">
              {category?.name || slug}
            </h1>
            <p className="text-xs sm:text-sm text-ink-body mt-2 leading-relaxed">
              {category?.description || "Commercial grade specifications, calibrated CMYK pre-press proofing, and fast dispatch."}
            </p>
          </div>

          <div className="bg-canvas-soft p-4 rounded-theme border border-border/60 text-xs shrink-0 space-y-1">
            <span className="text-ink-muted block font-medium">Standard SLA Turnaround:</span>
            <p className="font-display font-bold text-ink text-sm">24–48hr Dispatch Across Lagos</p>
            <span className="text-[11px] text-ink-muted">Nationwide Delivery via GIG Logistics</span>
          </div>
        </div>

        {/* Product Listing */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-card border border-border p-8 space-y-4">
            <p className="text-sm text-ink-body font-semibold">
              Currently compiling bespoke dielines and specifications for this category.
            </p>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Our factory can print any custom size or requirement. Contact our WhatsApp desk directly for an immediate tailored quote.
            </p>
            <a
              href={getWhatsAppLink(`Hello Iceberg Studio, I have a custom inquiry for ${category?.name || slug}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-button bg-[#25D366] text-white font-bold text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Request Custom Quote on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((prod) => (
              <div
                key={prod.slug}
                className="bg-card rounded-card border border-border/70 overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 w-full bg-canvas-soft overflow-hidden">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-theme bg-ink/80 text-white text-[11px] font-semibold backdrop-blur-xs">
                      {prod.turnaroundDays}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-primary block mb-1">
                      {prod.categoryName}
                    </span>
                    <h2 className="font-display font-bold text-lg text-ink line-clamp-1 group-hover:text-primary transition-colors">
                      {prod.title}
                    </h2>
                    <p className="text-xs text-ink-body mt-2 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/50 flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-ink-muted block">Starting From</span>
                        <span className="font-display font-black text-xl text-ink">
                          ₦{prod.basePrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-ink-muted font-medium">
                        Min: {prod.minQuantity} pcs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => openConfigure(prod)}
                    className="w-full py-2.5 px-4 rounded-button bg-canvas-soft hover:bg-primary hover:text-primary-foreground text-ink font-bold text-xs border border-border/80 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Configure & Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Configuration Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card rounded-card border border-border max-w-lg w-full p-6 md:p-8 shadow-elevation space-y-6 relative">
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-primary">
                  {selectedProduct.categoryName}
                </span>
                <h3 className="font-display font-bold text-xl text-ink mt-0.5">
                  {selectedProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-ink-muted hover:text-ink text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-2">
                Quantity Tier & Volume Pricing
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.quantityTiers?.map((t: any, idx: number) => (
                  <button
                    key={t.quantity}
                    type="button"
                    onClick={() => setSelectedTierIdx(idx)}
                    className={`p-3 rounded-button border text-left cursor-pointer transition-all ${
                      selectedTierIdx === idx
                        ? "bg-primary-pale border-primary text-ink"
                        : "bg-canvas-soft border-border text-ink-body hover:border-ink/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{t.quantity.toLocaleString()} pcs</span>
                      {selectedTierIdx === idx && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <div className="text-xs font-black text-ink mt-1">
                      ₦{t.totalPrice.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct.finishes && selectedProduct.finishes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-ink mb-2">
                  Select Finish / Coating
                </label>
                <div className="space-y-1.5">
                  {selectedProduct.finishes.map((f: string) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`w-full p-2.5 rounded-button text-xs font-medium text-left border flex items-center justify-between cursor-pointer transition-all ${
                        selectedFinish === f
                          ? "bg-primary-pale border-primary text-ink"
                          : "bg-canvas-soft border-border text-ink-body hover:border-ink/40"
                      }`}
                    >
                      <span>{f}</span>
                      {selectedFinish === f && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border/60 flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-button bg-canvas-muted hover:bg-border/60 text-ink font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex-1 py-3 px-4 rounded-button bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft"
              >
                <Send className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
