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
  ArrowUpRight,
} from "lucide-react";
import { RevealBlock, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

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
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, [initialCategories]);

  const featuredCategories = categories.slice(0, 2);
  const standardCategories = categories.slice(2, 10);

  return (
    <section className="py-16 md:py-24 bg-canvas-soft border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-border/60">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-[1.05]">
              Shop by Commercial Print Category
            </h2>
            <p className="text-sm md:text-base text-ink-muted mt-3 max-w-xl leading-relaxed">
              From bespoke packaging and luxury apparel to executive stationery
              and wide-format displays.
            </p>
          </div>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:text-primary transition-colors shrink-0 pb-1 border-b border-ink/25 hover:border-primary"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </RevealBlock>

        {/* Featured Editorial Duo (Bento Top Row) */}
        {featuredCategories.length > 0 && (
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {featuredCategories.map((cat, idx) => {
              const Icon = categoryIconMap[cat.iconName] || Package;
              return (
                <StaggerItem key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="relative h-64 sm:h-80 rounded-card overflow-hidden border border-card-border shadow-elevation antigravity-card flex flex-col justify-end p-6 sm:p-8 group bg-ink"
                  >
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-primary/30">
                        <Icon className="w-20 h-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                    <div className="relative z-10 flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                          {cat.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-1.5 max-w-md leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-button bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        )}

        {/* Standard Categories Grid */}
        <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {standardCategories.map((cat) => {
            const Icon = categoryIconMap[cat.iconName] || Package;
            return (
              <StaggerItem key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="h-full bg-card rounded-card border border-card-border overflow-hidden shadow-soft antigravity-card flex flex-col group p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="relative h-36 w-full rounded-theme overflow-hidden bg-canvas-soft mb-3.5">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary">
                        <Icon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-ink group-hover:text-primary transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <p className="text-[11px] text-ink-muted line-clamp-2 mt-0.5 leading-snug">
                    {cat.description}
                  </p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
