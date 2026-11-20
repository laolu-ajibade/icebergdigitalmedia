"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 12;

function CatalogProductCard({ prod }: { prod: any }) {
  const images = useMemo(() => {
    const arr =
      Array.isArray(prod.gallery) && prod.gallery.length > 0
        ? prod.gallery.filter(Boolean)
        : [prod.image || "/logo-icon.jpg"];
    return arr.length > 0 ? arr : ["/logo-icon.jpg"];
  }, [prod]);

  const [imgIdx, setImgIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="h-full bg-card rounded-card border border-border/80 overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group p-6 hover:border-primary/50 transition-colors">
      <div>
        <Link
          href={`/product/${prod.slug}`}
          className="block relative h-48 w-full rounded-theme overflow-hidden bg-canvas-soft mb-5"
        >
          <Image
            src={images[imgIdx] || images[0]}
            alt={prod.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {prod.deliveryDays && (
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-button bg-ink/85 text-white font-mono text-[10px] tracking-[0.12em] uppercase backdrop-blur-md border border-white/15 z-10">
              {prod.deliveryDays}
            </div>
          )}

          {images.length > 1 && (
            <>
              <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-button bg-black/55 backdrop-blur-md border border-white/15 font-mono text-[10px] text-white tabular-nums">
                {imgIdx + 1} / {images.length}
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous product image"
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next product image"
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </Link>

        <span className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-primary block mb-1.5">
          {prod.categoryName}
        </span>

        <Link
          href={`/product/${prod.slug}`}
          className="group/title flex items-start justify-between gap-2"
        >
          <h2 className="font-display font-bold text-lg text-ink line-clamp-1 group-hover:text-primary transition-colors">
            {prod.title}
          </h2>
          <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover:text-primary shrink-0 mt-1" />
        </Link>

        <p className="text-xs sm:text-sm text-ink-body mt-2 line-clamp-2 leading-relaxed">
          {prod.description}
        </p>

        <div className="mt-4 pt-3.5 border-t border-border/70 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              Starting From
            </span>
            <span className="font-display font-extrabold text-xl text-ink tabular-nums">
              ₦{prod.basePrice?.toLocaleString()}
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-muted font-medium">
            Min: {prod.minQuantity} pcs
          </span>
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={`/product/${prod.slug}`}
          className="w-full py-2.5 px-4 min-h-[42px] rounded-button bg-canvas-soft hover:bg-ink hover:text-canvas text-ink font-semibold text-xs tracking-wide uppercase border border-border hover:border-ink transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Configure &amp; Order</span>
        </Link>
      </div>
    </div>
  );
}

export function AllProductsCatalog({
  products,
  categories,
  tags = [],
}: {
  products: any[];
  categories: any[];
  tags?: any[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categoryTagsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    categories.forEach((c) => {
      if (c?.slug) {
        map.set(c.slug, Array.isArray(c.tags) ? c.tags : []);
      }
      if (c?.name) {
        map.set(c.name.toLowerCase(), Array.isArray(c.tags) ? c.tags : []);
      }
    });
    return map;
  }, [categories]);

  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    categories.forEach((c) => {
      if (c?.name) names.add(c.name);
    });
    products.forEach((p) => {
      if (p?.categoryName) names.add(p.categoryName);
    });
    return ["All", ...Array.from(names)];
  }, [categories, products]);

  const tagOptions = useMemo(() => {
    const tagList =
      tags.length > 0
        ? tags.map((t) => t.name)
        : Array.from(
            new Set(
              categories.flatMap((c) =>
                Array.isArray(c.tags) ? c.tags : ["Print"],
              ),
            ),
          );
    return ["All", ...tagList];
  }, [tags, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (p.categoryName || "").toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (selectedTag === "All") return true;

      const prodTags = Array.isArray(p.tags)
        ? p.tags
        : categoryTagsMap.get(p.categorySlug) ||
          categoryTagsMap.get((p.categoryName || "").toLowerCase()) ||
          [];

      return prodTags.some(
        (t: string) => t.toLowerCase() === selectedTag.toLowerCase(),
      );
    });
  }, [products, selectedCategory, selectedTag, categoryTagsMap]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
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
          <Link href="/categories" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">All Products</span>
        </div>

        {/* Header + Category & Tag Sort Dropdowns (Matching Categories View) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-border/60">
          <div className="max-w-2xl">
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight">
              Commercial Print Products
            </h1>
            <p className="text-sm sm:text-base text-ink-body mt-3 leading-relaxed">
              Browse all products across Print, Design, Packaging, Apparel, and Branding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[440px]">
            {/* Filter by Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Filter by Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-card border border-border text-xs font-bold text-ink shadow-soft cursor-pointer focus:outline-none focus:border-primary"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter by Tag Dropdown */}
            <div>
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
                      {tag === "All" ? "All Tags" : tag}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Directory Grid */}
        <div className="space-y-8">
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedProducts.map((prod) => (
                <CatalogProductCard key={prod.slug} prod={prod} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-card rounded-card border border-border">
              <p className="text-sm font-semibold text-ink">
                No products matched the selected category and tag.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedTag("All");
                  setCurrentPage(1);
                }}
                className="mt-4 px-5 py-2.5 rounded-button bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </div>
  );
}
