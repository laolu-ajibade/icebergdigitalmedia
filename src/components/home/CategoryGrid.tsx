"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Shirt,
  Coffee,
  Gift,
  Flag,
  Briefcase,
  FileText,
  Tag,
  CreditCard,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

const categoryIconMap: Record<string, React.ElementType> = {
  Package,
  Shirt,
  Coffee,
  Gift,
  Flag,
  Briefcase,
  FileText,
  Tag,
  CreditCard,
  ShoppingBag,
  Box: Package,
};

export function CategoryGrid({
  initialCategories,
}: {
  initialCategories?: any[];
}) {
  const [categories, setCategories] = useState<any[]>(initialCategories || []);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return;
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, [initialCategories]);

  return (
    <section className="py-16 md:py-24 bg-canvas-soft border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
              Shop by Commercial Print Category
            </h2>
            <p className="text-sm md:text-base text-ink-muted mt-2 max-w-xl">
              From bespoke packaging and luxury apparel to executive stationery
              and wide-format displays.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0"
          >
            <span>View Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid with Antigravity Elevation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.slice(0, 10).map(cat => {
            const Icon = categoryIconMap[cat.iconName] || Package;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="bg-card rounded-card border border-card-border overflow-hidden shadow-soft antigravity-card flex flex-col group p-4 hover:border-primary/50 transition-colors"
              >
                <div className="relative h-32 w-full rounded-theme overflow-hidden bg-canvas-soft mb-3">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary">
                      <Icon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-display font-bold text-xs text-ink group-hover:text-primary transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                </div>

                <p className="text-[11px] text-ink-muted line-clamp-2 mt-0.5 leading-snug">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
