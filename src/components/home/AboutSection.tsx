"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Award, CheckCircle2 } from "lucide-react";
import { R2_IMAGES } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { RegistrationMarks, RevealBlock } from "@/components/ui/MotionPrimitives";

export function AboutSection({ initialSettings }: { initialSettings?: any }) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;

  const headline =
    settings?.aboutHeadline ||
    "Capturing Your Imaginations in Commercial Prints.";
  const story = settings?.aboutStory || "";
  const checks: string[] = settings?.aboutChecks || [];
  const image = settings?.aboutImage || R2_IMAGES.boxes;
  const address =
    settings?.address ||
    "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria";

  return (
    <section
      id="about-studio"
      className="py-14 sm:py-16 md:py-24 bg-canvas border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Showcase Column (Left, matching template) */}
          <RevealBlock className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-[440px] w-full rounded-card overflow-hidden shadow-elevation border border-card-border">
              <Image
                src={image}
                alt="Iceberg Studio Commercial Printing Workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent sm:hidden" />
            </div>

            {/* Floating Glassmorphic Craftsmanship Card */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-5 sm:-right-5 bg-card/95 backdrop-blur-md border border-card-border p-4 sm:p-5 rounded-card shadow-elevation sm:max-w-xs">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-ink">
                    Lagos Craftsmanship
                  </h4>
                  <span className="text-[10px] text-ink-muted block">
                    Engineered in Shomolu
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-ink-body leading-relaxed">
                Industrial digital presses, precision die-cutting blades, and
                master hot-stamp foil artisans under one roof.
              </p>
            </div>
          </RevealBlock>

          {/* Content Column (Right, matching template) */}
          <RevealBlock delay={0.1} className="lg:col-span-7 space-y-5 lg:pl-4">
            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-[1.06]">
                {headline}
              </h2>
            </div>

            {story && (
              <p className="text-xs sm:text-sm text-ink-body leading-relaxed whitespace-pre-line">
                {story}
              </p>
            )}

            {/* Structured Craftsmanship Rows */}
            {checks.length > 0 && (
              <div className="space-y-3 pt-1">
                {checks.map((check, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-xs sm:text-sm"
                  >
                    <div className="w-6 h-6 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-ink leading-snug pt-0.5">
                      {check}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Elevated Studio Location Card */}
            <div className="p-3.5 sm:p-4 rounded-theme bg-canvas-soft border border-border/70 flex items-start sm:items-center gap-3 text-xs">
              <div className="w-7 h-7 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-ink block text-[11px] uppercase tracking-wider">
                  Lagos Production House
                </span>
                <span className="text-ink-muted leading-snug block mt-0.5">
                  {address}
                </span>
              </div>
            </div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
