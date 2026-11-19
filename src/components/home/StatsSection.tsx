"use client";

import React from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function StatsSection() {
  const settings = useSiteSettings();
  const stats: Array<{ value: string; label: string }> = settings?.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-canvas-soft border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 rounded-card bg-card border border-border/70 shadow-soft text-center antigravity-card flex flex-col items-center justify-center min-h-[112px] sm:min-h-[132px]"
            >
              <div className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight leading-none">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-ink-body mt-2 leading-snug max-w-[150px] sm:max-w-none">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
