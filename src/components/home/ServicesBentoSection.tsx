"use client";

import React from "react";
import Link from "next/link";
import {
  Printer,
  Package,
  Palette,
  Shirt,
  Flag,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { RevealBlock, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

const ICON_MAP: Record<string, React.ElementType> = {
  Printer,
  Package,
  Palette,
  Shirt,
  Flag,
  Layers,
  Sparkles,
};

const DEFAULT_CARDS = [
  {
    iconName: "Printer",
    title: "Digital Printing",
    description:
      "Crisp business cards, flyers, brochures, and stationery for your business or event.",
    isDark: false,
    href: "/categories",
  },
  {
    iconName: "Package",
    title: "Custom Packaging",
    description:
      "Branded gift boxes, product packaging, and shopping bags with foil finishes.",
    isDark: true,
    href: "/category/packaging-rigid-boxes",
  },
  {
    iconName: "Palette",
    title: "Brand Identity",
    description:
      "Logos, brand guidelines, and print-ready designs that make your business stand out.",
    isDark: false,
    href: "/categories",
  },
  {
    iconName: "Shirt",
    title: "Apparel & Merch",
    description:
      "Custom hoodies, polo shirts, caps, and branded ceramic mugs for teams and events.",
    isDark: false,
    href: "/category/custom-apparel-clothes",
  },
  {
    iconName: "Flag",
    title: "Signage & Banners",
    description:
      "Roll-up banners, event backdrops, vehicle branding, and storefront signs.",
    isDark: false,
    href: "/categories",
  },
];

export function ServicesBentoSection({
  initialSettings,
}: {
  initialSettings?: any;
}) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;

  const introLabel = settings?.servicesIntroLabel || "Our services";
  const introHeadline =
    settings?.servicesIntroHeadline ||
    "Creative Design, Digital Printing & Brand Identity.";
  const introSubtext =
    settings?.servicesIntroSubtext ||
    "We create quality prints, packaging, and brand designs for businesses and events across Nigeria.";
  const introLink = settings?.servicesIntroLink || "/categories";
  const cards: Array<{
    iconName?: string;
    title: string;
    description: string;
    isDark?: boolean;
    href?: string;
  }> =
    Array.isArray(settings?.servicesCards) && settings.servicesCards.length > 0
      ? settings.servicesCards
      : DEFAULT_CARDS;

  return (
    <section className="py-16 md:py-24 bg-canvas border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Tile 1: Editorial Intro Block */}
          <Link
            href={introLink}
            className="h-full rounded-card p-7 sm:p-8 border bg-canvas-soft/80 hover:bg-card text-ink border-card-border shadow-soft transition-all duration-300 antigravity-card flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-primary block">
                  {introLabel}
                </span>
                <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover:text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink group-hover:text-primary transition-colors tracking-tight leading-[1.15]">
                {introHeadline}
              </h2>
              <p className="text-sm text-ink-body mt-4 leading-relaxed">
                {introSubtext}
              </p>
            </div>
          </Link>

          {/* Tiles 2-6: Service Cards */}
          {cards.map((card, idx) => {
            const Icon = ICON_MAP[card.iconName || "Printer"] || Printer;
            const isDark = Boolean(card.isDark);
            const staggerOffset = idx === 0 || idx === 3 ? "lg:mt-8" : "";
            return (
              <div key={idx} className={`h-full ${staggerOffset}`}>
                <Link
                  href={card.href || "/categories"}
                  className={`h-full rounded-card p-7 sm:p-8 border transition-all duration-300 antigravity-card flex flex-col justify-between group ${
                    isDark
                      ? "bg-ink text-canvas border-ink shadow-elevation"
                      : "bg-canvas-soft/80 hover:bg-card text-ink border-card-border shadow-soft"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-10 h-10 rounded-theme flex items-center justify-center border ${
                          isDark
                            ? "bg-white/10 border-white/15 text-white"
                            : "bg-card border-border text-ink"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight
                        className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          isDark ? "text-white/60 group-hover:text-white" : "text-ink-muted group-hover:text-primary"
                        }`}
                      />
                    </div>

                    <h3
                      className={`font-display font-bold text-lg sm:text-xl mb-2.5 ${
                        isDark ? "text-white" : "text-ink group-hover:text-primary transition-colors"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? "text-white/75" : "text-ink-body"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
