"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sliders, Server, PackageCheck } from "lucide-react";
import { R2_IMAGES } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

const DEFAULT_PILLARS = [
  {
    icon: Sliders,
    title: "Our Mission",
    description:
      "Deliver innovative designs and quality print solutions that help your brand stand out.",
  },
  {
    icon: Server,
    title: "Fast Support",
    description:
      "Quick help with your artwork, paper choices, and order updates.",
  },
  {
    icon: PackageCheck,
    title: "Client Satisfaction",
    description:
      "Clean, reliable prints for your business, brand, or upcoming event.",
  },
];

export function TeamSection({ initialSettings }: { initialSettings?: any }) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;

  const companyName = settings?.companyName || "Iceberg Studio";
  const image = settings?.teamImage || R2_IMAGES.teamStudio;
  const ctaText = settings?.teamCtaText || "View other feature";
  const pillars =
    Array.isArray(settings?.teamPillars) && settings.teamPillars.length > 0
      ? settings.teamPillars.map((p: any, i: number) => ({
          icon: DEFAULT_PILLARS[i % DEFAULT_PILLARS.length].icon,
          title: p.title || DEFAULT_PILLARS[i % DEFAULT_PILLARS.length].title,
          description:
            p.description ||
            DEFAULT_PILLARS[i % DEFAULT_PILLARS.length].description,
        }))
      : DEFAULT_PILLARS;

  return (
    <section className="py-16 md:py-24 bg-canvas border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Studio Team Photograph */}
          <div className="lg:col-span-5">
            <div className="relative h-[420px] sm:h-[500px] w-full rounded-card overflow-hidden border border-card-border shadow-elevation bg-canvas-soft antigravity-card">
              <Image
                src={image}
                alt={`${companyName} Creative Print Team`}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Right: 3 Icon Pillars + CTA */}
          <div className="lg:col-span-7 space-y-6 lg:pl-4">
            <div className="space-y-5">
              {pillars.map((pillar: any, idx: number) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/15">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-ink">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-muted mt-0.5 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-5 py-2.5 min-h-[42px] rounded-button bg-ink text-canvas hover:bg-primary hover:text-primary-foreground font-semibold text-xs transition-colors shadow-soft"
              >
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
