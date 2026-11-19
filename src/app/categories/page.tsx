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
  ChevronDown,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 6;

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
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((res) => res.json()),
      fetch("/api/tags").then((res) => res.json()),
    ])
      .then(([catData, tagData]) => {
        if (catData.categories) setCategories(catData.categories);
        if (tagData.tags) setTags(tagData.tags);
      })
      .catch(() => {});
  }, []);

  const tagOptions = [
    "All",
    ...(tags.length > 0
      ? tags.map((t) => t.name)
      : Array.from(
          new Set(
            categories.flatMap((c) =>
              Array.isArray(c.tags) ? c.tags : ["Print"]
            )
          )
        )),
  ];

  const filteredCategories = categories.filter((cat) => {
    if (selectedTag === "All") return true;
    return (
      Array.isArray(cat.tags) &&
      cat.tags.some((t: string) => t.toLowerCase() === selectedTag.toLowerCase())
    );
  });

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border/60">
          <div className="max-w-2xl">
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight">
              Commercial Print & Design Categories
            </h1>
            <p className="text-sm sm:text-base text-ink-body mt-3 leading-relaxed">
              Browse all categories across Print, Design, Packaging, Apparel, and Branding. Filter by tag or select a category to configure your order.
            </p>
          </div>

          {/* Spacious Tag Filter Dropdown */}
          <div className="w-full sm:w-auto min-w-[240px]">
            <label className="block text-xs font-bold text-ink mb-1.5">
              Filter by Tag
            </label>
            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-card border border-border text-xs font-bold text-ink shadow-soft cursor-pointer focus:outline-none focus:border-primary"
              >
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === "All" ? "All Print & Design Tags" : tag}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories Directory Grid */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedCategories.map((cat) => {
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

                    {cat.tags && cat.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cat.tags.map((t: string) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-button bg-canvas-soft text-ink-muted border border-border/50"
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

          <Pagination
            currentPage={currentPage}
            totalItems={filteredCategories.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
