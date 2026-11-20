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
  ArrowRight,
  Instagram,
  Facebook,
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

  const resolveSocialUrl = (val: string | undefined, prefix: string) => {
    const trimmed = (val ?? "").trim();
    if (!trimmed) return "";
    const handle = trimmed
      .replace(/^https?:\/\/(www\.)?[^/]+\/(company\/|in\/)?/i, "")
      .replace(/^@+/, "")
      .replace(/\/+$/, "");
    return handle ? `${prefix}${handle}` : "";
  };

  const instagramUrl = resolveSocialUrl(settings?.instagramUrl, "https://instagram.com/");
  const facebookUrl = resolveSocialUrl(settings?.facebookUrl, "https://facebook.com/");
  const twitterUrl = resolveSocialUrl(settings?.twitterUrl, "https://x.com/");

  const navLinkClass = (active: boolean) =>
    `text-[11px] font-bold tracking-[0.08em] uppercase transition-colors ${
      active ? "text-primary" : "text-ink hover:text-primary"
    }`;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-xl border-b border-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center group min-w-0 shrink-0 py-1">
            <div className="relative h-16 sm:h-[72px] lg:h-20 w-52 sm:w-60 lg:w-64 shrink-0">
              <Image
                src="/logo.png?v=2"
                alt="Iceberg Creative Print Studio"
                fill
                sizes="(max-width: 640px) 208px, (max-width: 1024px) 240px, 256px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation (Exact Template Order: HOME, ALL PRODUCTS, BLOG, PORTFOLIO, ABOUT, CONTACT) */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link href="/" className={navLinkClass(pathname === "/")}>
              Home
            </Link>

            {/* All Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className={`flex items-center gap-1 cursor-pointer py-2 ${navLinkClass(
                  pathname?.startsWith("/categories") || pathname?.startsWith("/category") || pathname?.startsWith("/product"),
                )}`}
                aria-expanded={isDropdownOpen}
              >
                <span>All Products</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
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
                  className="absolute top-full -left-20 w-[640px] max-w-[calc(100vw-2rem)] bg-card rounded-card shadow-elevation border border-border/80 p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                >
                  <div className="col-span-2 pb-3.5 border-b border-border/60 flex items-start justify-between gap-6">
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">
                        Commercial Print Categories
                      </h4>
                      <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                        Select a category to view bespoke specifications, volume
                        pricing, and delivery times
                      </p>
                    </div>
                    <Link
                      href="/categories"
                      onClick={() => setIsDropdownOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0 whitespace-nowrap mt-0.5"
                    >
                      <span>View All Categories</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
              href="/blog"
              className={navLinkClass(pathname?.startsWith("/blog"))}
            >
              Blog
            </Link>

            <Link
              href="/portfolio"
              className={navLinkClass(pathname?.startsWith("/portfolio"))}
            >
              Portfolio
            </Link>

            <Link
              href="/about"
              className={navLinkClass(pathname?.startsWith("/about"))}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={navLinkClass(pathname?.startsWith("/contact"))}
            >
              Contact
            </Link>
          </nav>

          {/* Right Socials + Cart Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Social Icons matching template */}
            <div className="hidden sm:flex items-center gap-2 mr-1">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-1.5 text-ink-muted hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-1.5 text-ink-muted hover:text-primary transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="p-1.5 text-ink-muted hover:text-primary transition-colors font-bold text-xs leading-none"
                >
                  𝕏
                </a>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-button hover:bg-canvas-soft text-ink transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-4 h-4 text-ink" />
              {totalItemCount > 0 && (
                <span className="bg-primary text-primary-foreground font-bold text-[10px] px-1.5 py-0.5 rounded-button leading-none">
                  {totalItemCount}
                </span>
              )}
            </button>

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
            Categories
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
            href="/portfolio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-ink hover:text-primary"
          >
            Portfolio
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-ink hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-ink hover:text-primary"
          >
            Contact
          </Link>
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
