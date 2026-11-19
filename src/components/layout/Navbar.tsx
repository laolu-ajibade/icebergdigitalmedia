"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ShoppingBag,
  Package,
  Shirt,
  Coffee,
  Gift,
  Flag,
  Briefcase,
  FileText,
  Tag,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getWhatsAppLink } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

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

export function Navbar() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const [categories, setCategories] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItemCount, setIsCartOpen } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const printCategories = categories.filter(c =>
    c.tags ? c.tags.some((t: string) => t.toLowerCase() === "print") : true,
  );

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-theme overflow-hidden bg-white shadow-soft flex items-center justify-center p-0.5 border border-border/40">
              <Image
                src="/logo-icon.jpg"
                alt="Iceberg Print Studio Mark"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-xl tracking-tight text-ink">
                  Iceberg
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-primary">
                  Studio
                </span>
              </div>
              <span className="text-[10px] text-ink-muted hidden sm:block italic font-serif">
                {settings?.tagline || "Turning Ideas Into Impressions...."}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-ink hover:text-primary transition-colors"
            >
              Home
            </Link>

            {/* Categories Dropdown with 10+ items */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-primary transition-colors cursor-pointer py-2"
                aria-expanded={isDropdownOpen}
              >
                <span>Print Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen
                      ? "rotate-180 text-primary"
                      : "text-ink-muted"
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full -left-20 w-[640px] bg-card rounded-card shadow-elevation border border-border/80 p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                >
                  <div className="col-span-2 pb-3 border-b border-border/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">
                        Commercial Print Categories
                      </h4>
                      <p className="text-xs text-ink-muted">
                        Select a category to view bespoke specifications, volume
                        pricing, and delivery times
                      </p>
                    </div>
                    <Link
                      href="/categories"
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View All Categories →
                    </Link>
                  </div>

                  {printCategories.slice(0, 10).map(cat => {
                    const IconComponent =
                      categoryIconMap[cat.iconName] || Package;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-theme hover:bg-canvas-soft transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-ink-muted line-clamp-1">
                            {cat.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/categories"
              className="text-sm font-semibold text-ink hover:text-primary transition-colors"
            >
              Categories
            </Link>

            <Link
              href="/blog"
              className="text-sm font-semibold text-ink hover:text-primary transition-colors"
            >
              Blog
            </Link>

            <a
              href="#about-studio"
              className="text-sm font-semibold text-ink hover:text-primary transition-colors"
            >
              About Studio
            </a>

            <a
              href="#faq-section"
              className="text-sm font-semibold text-ink hover:text-primary transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-button bg-canvas-muted hover:bg-border/60 text-ink transition-colors cursor-pointer flex items-center gap-2"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-ink" />
              {totalItemCount > 0 && (
                <span className="bg-primary text-primary-foreground font-bold text-xs px-2 py-0.5 rounded-button">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Quote CTA */}
            <a
              href={getWhatsAppLink(
                "Hello Iceberg Studio, I would like to request a commercial print quote.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center px-4 py-2.5 rounded-button bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors shadow-soft"
            >
              Request a Quote
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-button bg-canvas-soft text-ink hover:bg-border/40"
              aria-label="Toggle mobile navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-canvas px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-ink hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-ink hover:text-primary"
          >
            Categories ({categories.length || 10})
          </Link>
          <div className="pl-3 py-1 space-y-1.5 border-l-2 border-primary/30 my-1">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
              Print Categories
            </span>
            {printCategories.slice(0, 10).map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs py-1 text-ink-body hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-ink hover:text-primary"
          >
            Blog
          </Link>
          <a
            href={getWhatsAppLink(
              "Hello Iceberg Studio, I would like to request a commercial print quote.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full py-2.5 rounded-button bg-primary text-primary-foreground font-semibold text-sm"
          >
            Request a Quote on WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
