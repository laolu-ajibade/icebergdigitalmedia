"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { ProductImageCarousel } from "@/components/ui/ProductImageCarousel";

export function TopSellingProducts({
  initialProducts,
}: {
  initialProducts?: any[];
}) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;
    fetch("/api/products?topSelling=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});
  }, [initialProducts]);

  return (
    <section
      id="top-selling"
      className="py-16 md:py-24 bg-canvas border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
              Top Selling Products
            </h2>
            <p className="text-sm md:text-base text-ink-muted mt-2 max-w-xl">
              Our most requested products and print runs by corporate brands, creative
              agencies, and luxury retailers across Nigeria.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.slice(0, 6).map((prod) => {
            const images =
              prod.gallery && prod.gallery.length > 0
                ? prod.gallery
                : [prod.image];
            return (
              <div
                key={prod.slug}
                className="bg-card rounded-card border border-card-border overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group"
              >
                <div>
                  <Link href={`/product/${prod.slug}`} className="block">
                    <ProductImageCarousel
                      images={images}
                      alt={prod.title}
                      heightClass="h-60"
                      overlayText={prod.turnaroundDays}
                    />
                  </Link>

                  <div className="p-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-primary block mb-1">
                      {prod.categoryName}
                    </span>
                    <Link href={`/product/${prod.slug}`}>
                      <h3 className="font-display font-bold text-lg text-ink line-clamp-1 group-hover:text-primary transition-colors">
                        {prod.title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-ink-body mt-2 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-card-border flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-ink-muted block">
                          Starting From
                        </span>
                        <span className="font-display font-black text-xl text-ink">
                          ₦{prod.basePrice?.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-ink-muted font-medium">
                        Min: {prod.minQuantity} pcs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/product/${prod.slug}`}
                    className="w-full py-2.5 px-4 min-h-[44px] rounded-button bg-canvas-soft hover:bg-primary hover:text-primary-foreground text-ink font-bold text-xs border border-border/80 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Configure & Order</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
