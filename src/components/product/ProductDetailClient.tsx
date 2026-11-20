"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Send,
  Check,
  ChevronDown,
  Truck,
  ShieldCheck,
  Clock,
  Layers,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { ProductImageCarousel } from "@/components/ui/ProductImageCarousel";

export default function ProductDetailClient({
  slug,
  initialProduct,
  initialRelatedProducts,
}: {
  slug: string;
  initialProduct?: any | null;
  initialRelatedProducts?: any[];
}) {
  const [product, setProduct] = useState<any | null>(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>(
    initialRelatedProducts || [],
  );
  const [loading, setLoading] = useState(!initialProduct);

  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const [selectedStock, setSelectedStock] = useState(
    initialProduct?.paperStocks?.[0] || "Standard Commercial Stock",
  );
  const [selectedFinish, setSelectedFinish] = useState(
    initialProduct?.finishes?.[0] || "Standard Matte Finish",
  );

  const { addItem, setIsCartOpen } = useCart();
  const settings = useSiteSettings();
  const whatsapp =
    (settings?.whatsappRouting || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;

  useEffect(() => {
    if (initialProduct) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/products/${slug}`).then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
    ])
      .then(([prodData, allData]) => {
        if (prodData.product) {
          const p = prodData.product;
          setProduct(p);
          setSelectedTierIdx(0);
          setSelectedStock(p.paperStocks?.[0] || "Standard Commercial Stock");
          setSelectedFinish(p.finishes?.[0] || "Standard Matte Finish");

          if (allData.products) {
            const others = allData.products.filter(
              (item: any) => item.slug !== p.slug,
            );
            const sameCat = others.filter(
              (item: any) => item.categorySlug === p.categorySlug,
            );
            const diffCat = others.filter(
              (item: any) => item.categorySlug !== p.categorySlug,
            );
            setRelatedProducts([...sameCat, ...diffCat].slice(0, 3));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, initialProduct]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-canvas-soft space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-semibold text-ink-muted">
          Loading print specifications...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-canvas-soft p-6 text-center space-y-4">
        <h1 className="font-display font-black text-2xl text-ink">
          Product Not Found
        </h1>
        <p className="text-xs text-ink-muted max-w-md">
          The print specification you requested could not be found in our
          catalog.
        </p>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Categories</span>
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const activeTier = product.quantityTiers?.[selectedTierIdx] || {
    quantity: product.minQuantity || 1,
    pricePerUnit: Math.round(
      (product.basePrice || 0) / (product.minQuantity || 1),
    ),
    totalPrice: product.basePrice || 0,
  };

  const specsEntries = product.specifications
    ? Object.entries(product.specifications)
    : [];

  const handleAddToCart = () => {
    addItem({
      productId: product.slug,
      title: product.title,
      category: product.categoryName,
      quantity: activeTier.quantity,
      unitPrice: activeTier.pricePerUnit,
      paperStock: selectedStock,
      finish: selectedFinish,
      image: galleryImages[0],
    });
    setIsCartOpen(true);
  };

  const handleOrderWhatsApp = () => {
    let msg = `*PRODUCT ORDER INQUIRY - ICEBERG STUDIO*\n\n`;
    msg += `📦 *Product:* ${product.title}\n`;
    msg += `📁 *Category:* ${product.categoryName}\n`;
    msg += `🔢 *Quantity:* ${activeTier.quantity.toLocaleString()} pcs (₦${activeTier.pricePerUnit.toLocaleString()}/unit)\n`;
    msg += `📄 *Paper Stock:* ${selectedStock}\n`;
    msg += `✨ *Finish / Coating:* ${selectedFinish}\n`;
    msg += `⏱️ *Turnaround SLA:* ${product.turnaroundDays}\n`;
    msg += `💰 *Total Price:* ₦${activeTier.totalPrice.toLocaleString()}\n\n`;
    msg += `Hello Iceberg Studio team, I would like to place this configured print order and submit my artwork.`;

    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <div className="py-10 md:py-16 bg-canvas-soft min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/categories"
            className="hover:text-primary transition-colors"
          >
            Categories
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.categorySlug}`}
            className="hover:text-primary transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold line-clamp-1">
            {product.title}
          </span>
        </div>

        {/* Main 2-Column Studio Configuration Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Multi-Image Swipe Carousel & Technical Specifications */}
          <div className="lg:col-span-7 space-y-8">
            <ProductImageCarousel
              images={galleryImages}
              alt={product.title}
              heightClass="h-72 sm:h-[440px] rounded-card border border-border/80 shadow-elevation"
              showThumbnails={true}
              overlayText={`Turnaround: ${product.turnaroundDays}`}
            />

            {/* Technical Print Specifications & Guarantees */}
            <div className="bg-card rounded-card border border-border/80 p-6 sm:p-8 shadow-soft space-y-6">
              <div className="border-b border-border/60 pb-4">
                <h2 className="font-display font-bold text-lg text-ink">
                  Technical Print & Material Specifications
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Calibrated production standards at our Shomolu, Lagos printing
                  facility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-theme bg-canvas-soft border border-border/60">
                  <span className="text-ink-muted block mb-1">
                    Minimum Order Run
                  </span>
                  <span className="font-bold text-ink text-sm">
                    {product.minQuantity.toLocaleString()} Pieces
                  </span>
                </div>
                <div className="p-3.5 rounded-theme bg-canvas-soft border border-border/60">
                  <span className="text-ink-muted block mb-1">
                    Production Turnaround
                  </span>
                  <span className="font-bold text-ink text-sm">
                    {product.turnaroundDays}
                  </span>
                </div>
                {specsEntries.map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-theme bg-canvas-soft border border-border/60"
                  >
                    <span className="text-ink-muted block mb-1">{key}</span>
                    <span className="font-bold text-ink text-sm">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2.5 text-ink">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Same-Day Digital Proof</span>
                </div>
                <div className="flex items-center gap-2.5 text-ink">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Calibrated CMYK Press</span>
                </div>
                <div className="flex items-center gap-2.5 text-ink">
                  <Truck className="w-4 h-4 text-primary shrink-0" />
                  <span>Lagos & 36 States Dispatch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Configure & Order Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-card rounded-card border border-border/80 p-6 sm:p-8 shadow-elevation space-y-6">
            <div className="border-b border-border/60 pb-5 space-y-2">
              <Link
                href={`/category/${product.categorySlug}`}
                className="text-xs font-bold uppercase tracking-wider text-primary hover:underline block"
              >
                {product.categoryName}
              </Link>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight leading-tight">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-ink-body leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* 1. Quantity Tier & Volume Discount Selector */}
            {(() => {
              const tiers =
                product.quantityTiers && product.quantityTiers.length > 0
                  ? product.quantityTiers
                  : [activeTier];
              const isSingleTier = tiers.length === 1;
              return (
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-ink">
                    1. Select Quantity Tier (Volume Discount Pricing)
                  </label>
                  <div
                    className={`grid gap-2.5 ${
                      isSingleTier ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {tiers.map((t: any, idx: number) => {
                      const isSelected = selectedTierIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedTierIdx(idx)}
                          className={`p-4 rounded-theme border text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-primary-pale border-primary text-ink shadow-soft ring-1 ring-primary/20"
                              : "bg-canvas-soft border-border text-ink-body hover:border-ink/40 hover:bg-card"
                          }`}
                        >
                          {isSingleTier ? (
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <span className="font-bold text-xs text-ink block">
                                  {t.quantity.toLocaleString()} pcs
                                </span>
                                <span className="text-[11px] text-ink-muted">
                                  ₦{t.pricePerUnit?.toLocaleString()} / unit
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-display font-black text-lg text-ink">
                                  ₦{t.totalPrice.toLocaleString()}
                                </span>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-primary shrink-0" />
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-ink">
                                  {t.quantity.toLocaleString()} pcs
                                </span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-primary" />
                                )}
                              </div>
                              <div className="font-display font-black text-base text-ink mt-1">
                                ₦{t.totalPrice.toLocaleString()}
                              </div>
                              <div className="text-[11px] text-ink-muted">
                                ₦{t.pricePerUnit?.toLocaleString()} / unit
                              </div>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 2. Paper Stock / Material Dropdown */}
            {product.paperStocks && product.paperStocks.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink">
                  2. Select Paper Stock / Material Specification
                </label>
                <div className="relative">
                  <select
                    value={selectedStock}
                    onChange={e => setSelectedStock(e.target.value)}
                    className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-canvas-soft border border-border text-xs font-semibold text-ink focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {product.paperStocks.map((stock: string) => (
                      <option key={stock} value={stock}>
                        {stock}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* 3. Finish / Coating Dropdown */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink">
                  3. Select Lamination / Finishing Option
                </label>
                <div className="relative">
                  <select
                    value={selectedFinish}
                    onChange={e => setSelectedFinish(e.target.value)}
                    className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-canvas-soft border border-border text-xs font-semibold text-ink focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {product.finishes.map((finish: string) => (
                      <option key={finish} value={finish}>
                        {finish}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Live Order Summary Box */}
            <div className="p-4 sm:p-5 rounded-theme bg-canvas-soft border border-border/80 shadow-soft space-y-2.5 text-xs">
              <div className="flex items-baseline justify-between gap-4 text-ink-muted">
                <span className="shrink-0">Selected Run</span>
                <span className="font-bold text-ink text-right">
                  {activeTier.quantity.toLocaleString()} pcs (₦
                  {activeTier.pricePerUnit?.toLocaleString()}/unit)
                </span>
              </div>
              {selectedStock && (
                <div className="flex items-baseline justify-between gap-4 text-ink-muted">
                  <span className="shrink-0">Material</span>
                  <span className="font-semibold text-ink text-right">
                    {selectedStock}
                  </span>
                </div>
              )}
              {selectedFinish && (
                <div className="flex items-baseline justify-between gap-4 text-ink-muted">
                  <span className="shrink-0">Finishing</span>
                  <span className="font-semibold text-ink text-right">
                    {selectedFinish}
                  </span>
                </div>
              )}
              <div className="pt-3 mt-1 border-t border-border/60 flex items-baseline justify-between gap-4">
                <span className="font-bold text-ink">
                  Total Production Cost
                </span>
                <span className="font-display font-black text-2xl text-ink">
                  ₦{activeTier.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 min-h-[48px] rounded-button bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none flex items-center justify-center gap-2 cursor-pointer shadow-soft"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Print Cart</span>
              </button>

              <button
                type="button"
                onClick={handleOrderWhatsApp}
                className="w-full py-3.5 px-4 min-h-[44px] rounded-button bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft"
              >
                <Send className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Similar Products & What Other Clients Ordered */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-border/60 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">
                  Frequently Ordered Together
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
                  Similar Products & What Other Clients Ordered
                </h2>
              </div>
              <Link
                href="/categories"
                className="text-xs font-bold text-primary hover:underline"
              >
                Explore All Categories →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProducts.map(rel => {
                const relImages =
                  rel.gallery && rel.gallery.length > 0
                    ? rel.gallery
                    : [rel.image];
                return (
                  <div
                    key={rel.slug}
                    className="bg-card rounded-card border border-border/70 overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group"
                  >
                    <div>
                      <Link href={`/product/${rel.slug}`} className="block">
                        <ProductImageCarousel
                          images={relImages}
                          alt={rel.title}
                          heightClass="h-56"
                          overlayText={rel.turnaroundDays}
                        />
                      </Link>

                      <div className="p-6">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-primary block mb-1">
                          {rel.categoryName}
                        </span>
                        <Link href={`/product/${rel.slug}`}>
                          <h3 className="font-display font-bold text-lg text-ink line-clamp-1 group-hover:text-primary transition-colors">
                            {rel.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-ink-body mt-2 line-clamp-2 leading-relaxed">
                          {rel.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-border/50 flex items-baseline justify-between">
                          <div>
                            <span className="text-[11px] text-ink-muted block">
                              Starting From
                            </span>
                            <span className="font-display font-black text-xl text-ink">
                              ₦{rel.basePrice?.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs text-ink-muted font-medium">
                            Min: {rel.minQuantity} pcs
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <Link
                        href={`/product/${rel.slug}`}
                        className="w-full py-2.5 px-4 min-h-[44px] rounded-button bg-canvas-soft hover:bg-primary hover:text-primary-foreground text-ink font-bold text-xs border border-border/80 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
