"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Zap, Layers } from "lucide-react";
import { LivePrintCanvas } from "./LivePrintCanvas";

export function Hero() {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split 50/50 Stage: Left Brand Copy & Right Live Print Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-primary block">
              Commercial Printing Press & Packaging Atelier
            </span>

            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-ink tracking-[-0.04em] leading-[1.0]">
              Commercial Grade Printing & Bespoke Packaging.
            </h1>

            <p className="text-sm sm:text-base text-ink-body font-normal leading-relaxed">
              Test your brand name on luxury cotton apparel, ceramic mugs,
              foil-stamped business cards, and magnetic boxes live on our
              interactive 3D studio canvas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
              >
                <span>Browse 10+ Print Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#top-selling"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-button bg-canvas border border-border hover:bg-canvas-soft text-ink font-semibold text-xs transition-colors"
              >
                <span>Explore Top Selling</span>
              </a>
            </div>

            {/* Guarantees Grid */}
            <div className="pt-6 grid grid-cols-2 gap-3.5 border-t border-border/40 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">
                  600gsm Cotton Boards
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">
                  24–48hr Lagos Dispatch
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">
                  36 States Delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">
                  Calibrated CMYK SLA
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live 3D Interactive Print Studio Canvas */}
          <div className="lg:col-span-7">
            <LivePrintCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
