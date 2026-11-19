"use client";

import React from "react";

export function StatsSection() {
  const stats = [
    {
      value: "500,000+",
      label: "Prints Completed",
      subtext: "Corporate & retail runs produced",
    },
    {
      value: "99.4%",
      label: "On-Time SLA Delivery",
      subtext: "Strict factory dispatch guarantee",
    },
    {
      value: "4.9 / 5.0",
      label: "Verified Client Rating",
      subtext: "120+ verified Google business reviews",
    },
    {
      value: "36 States",
      label: "Nationwide Delivery",
      subtext: "Kwik, Bolt & GIG Logistics network",
    },
  ];

  return (
    <section className="py-12 bg-canvas-soft border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-card bg-card border border-border/70 shadow-soft text-center"
            >
              <div className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
                {s.value}
              </div>
              <div className="text-xs font-bold text-ink mt-1">
                {s.label}
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                {s.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
