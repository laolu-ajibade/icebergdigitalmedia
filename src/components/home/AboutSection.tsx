"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Award, CheckCircle2 } from "lucide-react";
import { R2_IMAGES } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function AboutSection() {
  const settings = useSiteSettings();

  const headline =
    settings?.aboutHeadline || "Capturing Your Imaginations in Commercial Prints.";
  const story = settings?.aboutStory || "";
  const checks: string[] = settings?.aboutChecks || [];
  const image = settings?.aboutImage || R2_IMAGES.boxes;
  const address =
    settings?.address ||
    "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria";

  return (
    <section id="about-studio" className="py-16 md:py-24 bg-canvas border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-primary block mb-2">
              About Iceberg Creative Print Studio
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight leading-tight">
              {headline}
            </h2>
            {story && (
              <p className="text-xs sm:text-sm text-ink-body mt-4 leading-relaxed whitespace-pre-line">
                {story}
              </p>
            )}

            {checks.length > 0 && (
              <div className="mt-6 space-y-2.5">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-ink">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border/60 flex items-center gap-3 text-xs text-ink-muted">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>Studio: {address}</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-96 w-full rounded-card overflow-hidden shadow-elevation border border-border/80">
              <Image
                src={image}
                alt="Iceberg Studio Commercial Printing Workshop"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-border/80 p-5 rounded-card shadow-elevation hidden sm:block max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-ink">Lagos Craftsmanship</h4>
                  <span className="text-[10px] text-ink-muted">Engineered in Shomolu</span>
                </div>
              </div>
              <p className="text-[11px] text-ink-body leading-relaxed">
                Industrial digital presses, precision die-cutting blades, and master hot-stamp foil artisans under one roof.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
