"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { RevealBlock } from "@/components/ui/MotionPrimitives";

function PortfolioCard({ prod }: { prod: any }) {
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
    <Link
      href={`/product/${prod.slug}`}
      className="group relative rounded-card overflow-hidden bg-card border border-card-border shadow-soft antigravity-card block h-64"
    >
      <Image
        src={images[imgIdx] || images[0]}
        alt={prod.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

      {images.length > 1 && (
        <>
          <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-button bg-black/55 backdrop-blur-md border border-white/15 font-mono text-[10px] text-white tabular-nums">
            {imgIdx + 1} / {images.length}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 left-2.5 right-2.5 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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

      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3 text-white z-10">
        <div className="min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 block">
            {prod.categoryName}
          </span>
          <h3 className="font-display font-bold text-base sm:text-lg text-white line-clamp-1 mt-0.5">
            {prod.title}
          </h3>
          {prod.basePrice ? (
            <span className="font-mono text-xs text-white/85 tabular-nums mt-0.5 block">
              From ₦{prod.basePrice.toLocaleString()}
            </span>
          ) : null}
        </div>
        <div className="w-9 h-9 rounded-button bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </Link>
  );
}

export function PortfolioShowcase({
  initialProducts,
  initialCategories,
  initialSettings,
}: {
  initialProducts?: any[];
  initialCategories?: any[];
  initialSettings?: any;
}) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;

  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [categories, setCategories] = useState<any[]>(initialCategories || []);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [maxDisplay, setMaxDisplay] = useState<number>(40);

  useEffect(() => {
    const updateLimit = () => {
      setMaxDisplay(window.innerWidth < 768 ? 20 : 40);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data.products) setProducts(data.products);
        })
        .catch(() => {});
    }
    if (!initialCategories || initialCategories.length === 0) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (data.categories) setCategories(data.categories);
        })
        .catch(() => {});
    }
  }, [initialProducts, initialCategories]);

  const headline =
    settings?.portfolioHeadline || "Our Portfolio, Quality Results";
  const subtext =
    settings?.portfolioSubtext ||
    "Explore our recent print runs, packaging, and branded items.";

  const filterTabs = useMemo(() => {
    const names = new Set<string>();
    categories.slice(0, 6).forEach((c) => {
      if (c?.name) names.add(c.name);
    });
    products.forEach((p) => {
      if (p?.categoryName) names.add(p.categoryName);
    });
    return ["all", ...Array.from(names).slice(0, 6)];
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter(
      (p) =>
        (p.categoryName || "").toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [products, activeFilter]);

  const displayItems = filteredProducts.slice(0, maxDisplay);

  return (
    <section
      id="portfolio-showcase"
      className="py-16 md:py-24 bg-canvas-soft border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealBlock className="text-center max-w-2xl mx-auto mb-6 md:mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-tight">
            {headline}
          </h2>
          <p className="text-sm md:text-base text-ink-body mt-3 leading-relaxed">
            {subtext}
          </p>
        </RevealBlock>

        {/* Mobile Category Filter Dropdown */}
        <div className="md:hidden max-w-xs mx-auto mb-8 relative">
          <label htmlFor="portfolio-category-filter" className="sr-only">
            Filter portfolio by category
          </label>
          <select
            id="portfolio-category-filter"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full appearance-none px-4 py-3 pr-10 min-h-[44px] rounded-button bg-card border border-border text-ink font-semibold text-sm shadow-soft cursor-pointer focus:outline-none focus:border-primary"
          >
            {filterTabs.map((tab) => (
              <option key={tab} value={tab}>
                {tab === "all" ? "All Work" : tab}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Desktop Category Filter Tabs */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 min-h-[40px] rounded-button text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-ink text-canvas shadow-soft"
                    : "bg-card text-ink-body border border-border hover:border-ink/40 hover:text-ink"
                }`}
              >
                {tab === "all" ? "All Work" : tab}
              </button>
            );
          })}
        </div>

        {/* Uniform-Height 3-Column Portfolio Grid (up to 40 products) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {displayItems.map((prod) => (
            <PortfolioCard key={prod.slug} prod={prod} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-button bg-card hover:bg-ink hover:text-canvas text-ink font-semibold text-xs uppercase tracking-wider border border-border transition-colors shadow-soft"
          >
            Browse Full Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
