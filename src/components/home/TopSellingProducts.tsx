"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductImageCarousel } from "@/components/ui/ProductImageCarousel";
import { RevealBlock, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

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
      className="py-16 md:py-24 bg-canvas border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-border/60">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-[1.05]">
              Most-Ordered by Growing Brands
            </h2>
            <p className="text-sm md:text-base text-ink-muted mt-3 max-w-xl leading-relaxed">
              Client-favorite packaging, stationery, and branded merch trusted by
              startups and retailers across Nigeria.
            </p>
          </div>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:text-primary transition-colors shrink-0 pb-1 border-b border-ink/25 hover:border-primary"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </RevealBlock>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.slice(0, 6).map((prod, idx) => {
            const images =
              prod.gallery && prod.gallery.length > 0
                ? prod.gallery
                : [prod.image];
            return (
              <StaggerItem key={prod.slug} className="h-full">
                <div className="h-full bg-card rounded-card border border-card-border overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group">
                  <div>
                    <Link href={`/product/${prod.slug}`} className="block relative overflow-hidden">
                      <ProductImageCarousel
                        images={images}
                        alt={prod.title}
                        heightClass="h-64"
                        overlayText={prod.turnaroundDays}
                      />
                    </Link>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-primary">
                          {prod.categoryName}
                        </span>
                        <span className="font-mono text-[10px] text-ink-muted">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <Link href={`/product/${prod.slug}`} className="group/title flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-ink line-clamp-1 group-hover:text-primary transition-colors">
                          {prod.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover:text-primary shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      <p className="text-xs sm:text-sm text-ink-body mt-2 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      <div className="mt-5 pt-4 border-t border-card-border flex items-baseline justify-between">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                            Starting From
                          </span>
                          <span className="font-display font-extrabold text-2xl text-ink tabular-nums">
                            ₦{prod.basePrice?.toLocaleString()}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-ink-muted font-medium">
                          Min: {prod.minQuantity} pcs
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/product/${prod.slug}`}
                      className="w-full py-3 px-4 min-h-[44px] rounded-button bg-canvas-soft hover:bg-ink hover:text-canvas text-ink font-bold text-xs tracking-wide uppercase border border-border/80 hover:border-ink transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Configure & Order</span>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
