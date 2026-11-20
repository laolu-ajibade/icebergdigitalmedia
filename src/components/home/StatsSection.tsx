"use client";

import React from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

export function StatsSection({
  initialStats,
}: {
  initialStats?: Array<{ value: string; label: string }>;
}) {
  const settings = useSiteSettings();
  const stats: Array<{ value: string; label: string }> =
    initialStats && initialStats.length > 0
      ? initialStats
      : settings?.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-ink text-canvas border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/15 border border-white/15 rounded-card bg-white/[0.02] backdrop-blur-sm">
          {stats.map((s, idx) => (
            <StaggerItem key={idx}>
              <div className="p-6 sm:p-8 flex flex-col justify-center min-h-[128px] sm:min-h-[144px]">
                <div className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-white/75 mt-2.5 leading-snug">
                  {s.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
