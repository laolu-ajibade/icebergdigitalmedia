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
    <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((s, idx) => (
            <StaggerItem key={idx}>
              <div className="py-4 px-3 flex flex-col items-center justify-center">
                <div className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-primary-foreground tracking-tight leading-none tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-primary-foreground/85 mt-2.5 leading-snug">
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
