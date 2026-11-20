"use client";

import React from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function ClientBrandsStrip({
  initialSettings,
}: {
  initialSettings?: any;
}) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;

  const brands: string[] = Array.isArray(settings?.clientBrands)
    ? settings.clientBrands.filter((b: string) => typeof b === "string" && b.trim().length > 0)
    : [];

  if (brands.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 bg-canvas border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted shrink-0">
            Trusted by leading brands
          </span>
          <div className="flex flex-wrap items-center gap-x-8 sm:gap-x-12 gap-y-3">
            {brands.map((brand, idx) => (
              <span
                key={idx}
                className="font-display font-bold text-base sm:text-lg text-ink/45 hover:text-ink transition-colors select-none"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
