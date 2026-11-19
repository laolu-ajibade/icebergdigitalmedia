"use client";

import React from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function StatsSection() {
  const settings = useSiteSettings();
  const stats: Array<{ value: string; label: string }> = settings?.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="py-12 bg-canvas-soft border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-card bg-card border border-border/70 shadow-soft text-center antigravity-card"
            >
              <div className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
                {s.value}
              </div>
              <div className="text-xs font-bold text-ink mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
