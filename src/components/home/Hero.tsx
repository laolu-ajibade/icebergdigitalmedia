"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Zap, Layers } from "lucide-react";
import { LivePrintCanvas } from "./LivePrintCanvas";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function Hero() {
  const settings = useSiteSettings();

  const headline =
    settings?.heroHeadline ||
    "Commercial Precision Printing & Bespoke Packaging Atelier";
  const subtext =
    settings?.heroSubtext ||
    "High-definition digital press, bespoke rigid boxes, and luxury brand collateral produced in Shomolu, Lagos. Delivered nationwide across Nigeria.";
  const primaryCtaText = settings?.heroPrimaryCtaText || "Explore Products";
  const primaryCtaLink = settings?.heroPrimaryCtaLink || "#top-selling";
  const secondaryCtaText =
    settings?.heroSecondaryCtaText || "Instant WhatsApp Quote";
  const secondaryCtaLink =
    settings?.heroSecondaryCtaLink || "https://wa.me/2348023093704";

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-primary block">
              Commercial Printing Press & Packaging Atelier
            </span>

            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-ink tracking-[-0.04em] leading-[1.08]">
              {headline}
            </h1>

            <p className="text-sm sm:text-base text-ink-body font-normal leading-relaxed">
              {subtext}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <Link
                href={primaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={secondaryCtaLink}
                target={secondaryCtaLink.startsWith("http") ? "_blank" : undefined}
                rel={
                  secondaryCtaLink.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-button bg-canvas border border-border hover:bg-canvas-soft text-ink font-semibold text-xs transition-colors"
              >
                <span>{secondaryCtaText}</span>
              </a>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-3.5 border-t border-border/40 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">600gsm Cotton Boards</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">24–48hr Lagos Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">36 States Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink">Calibrated CMYK SLA</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <LivePrintCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
