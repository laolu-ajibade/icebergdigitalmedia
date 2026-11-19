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

export default function CategoriesMasterPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  // Compute unique tags from all categories
  const allTags = [
    "All",
    ...Array.from(
      new Set(
        categories.flatMap((c) => (Array.isArray(c.tags) ? c.tags : ["Print"]))
      )
    ),
  ];

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    if (selectedTag === "All") return true;
    return Array.isArray(cat.tags) && cat.tags.some((t: string) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  return (
    <div className="py-12 md:py-20 bg-canvas-soft min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">Categories</span>
        </div>

        <div className="max-w-3xl mb-8">
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight">
            Commercial Print & Design Categories
          </h1>
          <p className="text-sm sm:text-base text-ink-body mt-3 leading-relaxed">
            Browse all categories across Print, Design, Packaging, and Merchandise. Filter by tag or select a category for volume discount tables.
          </p>
        </div>

        {/* Interactive Tag Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap mb-10 pb-4 border-b border-border/60">
          <span className="text-xs font-bold text-ink mr-2">Filter by Tag:</span>
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-button text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card border border-border text-ink-body hover:border-ink/40"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Categories Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredCategories.map((cat) => {
            const Icon = categoryIconMap[cat.iconName] || Package;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="bg-card rounded-card border border-border/80 overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group p-6 hover:border-primary/50 transition-colors"
              >
                <div>
                  <div className="relative h-48 w-full rounded-theme overflow-hidden bg-canvas-soft mb-5">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary">
                        <Icon className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="font-display font-bold text-lg text-ink group-hover:text-primary transition-colors">
                      {cat.name}
                    </h2>
                  </div>

                  <p className="text-xs text-ink-body leading-relaxed mb-3">
                    {cat.description}
                  </p>

                  {/* Category Tags */}
                  {cat.tags && cat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cat.tags.map((t: string) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-button bg-canvas-soft text-ink-muted border border-border/50"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Explore Products in this Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
