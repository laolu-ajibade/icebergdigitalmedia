"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Send } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";
import { ProductImageCarousel } from "@/components/ui/ProductImageCarousel";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 6;

export default function CategoryDetailClient({
  slug,
  initialCategory,
  initialProducts,
}: {
  slug: string;
  initialCategory?: any | null;
  initialProducts?: any[];
}) {
  const [category, setCategory] = useState<any | null>(initialCategory || null);
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (initialCategory) return;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          const found = data.categories.find((c: any) => c.slug === slug);
          setCategory(
            found || {
              name: slug.replace(/-/g, " "),
              slug,
              description: "Commercial printing services",
            }
          );
        }
      })
      .catch(() => {});

    fetch(`/api/products?category=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});
  }, [slug, initialCategory]);

  return (
    <div className="py-12 md:py-20 bg-canvas-soft min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted mb-8">
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

        <div className="bg-card rounded-card border border-border/80 p-6 sm:p-8 md:p-10 shadow-soft mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Categories</span>
            </Link>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight capitalize">
              {category?.name || slug}
            </h1>
            <p className="text-xs sm:text-sm text-ink-body mt-2 leading-relaxed">
              {category?.description ||
                "Commercial grade specifications, calibrated CMYK pre-press proofing, and fast dispatch."}
            </p>
          </div>

          <div className="bg-canvas-soft p-4 rounded-theme border border-border/60 text-xs shrink-0 space-y-1">
            <span className="text-ink-muted block font-medium">
              Standard SLA Turnaround:
            </span>
            <p className="font-display font-bold text-ink text-sm">
              24–48hr Dispatch Across Lagos
            </p>
            <span className="text-[11px] text-ink-muted">
              Nationwide Delivery via GIG Logistics
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-card border border-border p-8 space-y-4">
            <p className="text-sm text-ink-body font-semibold">
              Currently compiling bespoke dielines and specifications for this category.
            </p>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Our factory can print any custom size or requirement. Contact our WhatsApp desk directly for an immediate tailored quote.
            </p>
            <a
              href={getWhatsAppLink(
                `Hello Iceberg Studio, I have a custom inquiry for ${category?.name || slug}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-button bg-[#25D366] text-white font-bold text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Request Custom Quote on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedProducts.map((prod) => {
                const images =
                  prod.gallery && prod.gallery.length > 0
                    ? prod.gallery
                    : [prod.image];
                return (
                  <div
                    key={prod.slug}
                    className="bg-card rounded-card border border-border/70 overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group"
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
                          <h2 className="font-display font-bold text-lg text-ink line-clamp-1 group-hover:text-primary transition-colors">
                            {prod.title}
                          </h2>
                        </Link>
                        <p className="text-xs text-ink-body mt-2 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-border/50 flex items-baseline justify-between">
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
                        <span>Order</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={products.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
