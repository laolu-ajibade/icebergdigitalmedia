"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { R2_IMAGES } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

const EASE_ATELIER: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({ initialSettings }: { initialSettings?: any }) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;
  const prefersReduced = useReducedMotion();

  const headline =
    settings?.heroHeadline || "Design, Print & Brand with Iceberg Studio.";
  const subtext =
    settings?.heroSubtext ||
    "All Types of Printing | Corporate Branding | Custom Packaging | Signage | Promotional Products | Large-Scale Branding & Production.";
  const primaryCtaText = settings?.heroPrimaryCtaText || "Explore Products";
  const primaryCtaLink =
    !settings?.heroPrimaryCtaLink ||
    settings.heroPrimaryCtaLink.startsWith("#")
      ? "/products"
      : settings.heroPrimaryCtaLink;
  const heroImage = settings?.heroImage || R2_IMAGES.heroPackaging;
  const focusDesktop = settings?.heroImageFocusDesktop || "50% 50%";
  const focusMobile = settings?.heroImageFocusMobile || focusDesktop;

  return (
    <section className="relative w-full min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] flex items-center bg-ink overflow-hidden">
      {/* Full-Bleed Studio Background Image — Desktop */}
      <Image
        src={heroImage}
        alt="Iceberg Creative Print Studio Showcase"
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: focusDesktop }}
        className="hidden md:block object-cover pointer-events-none select-none"
      />
      {/* Full-Bleed Studio Background Image — Mobile */}
      <Image
        src={heroImage}
        alt="Iceberg Creative Print Studio Showcase"
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: focusMobile }}
        className="md:hidden object-cover pointer-events-none select-none"
      />

      {/* Atmospheric Dark Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/45 md:bg-gradient-to-r md:from-black/85 md:via-black/65 md:to-black/40 pointer-events-none"
      />

      {/* Left-Aligned Editorial Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-24">
        <div className="max-w-2xl space-y-5 sm:space-y-6">
          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_ATELIER }}
            className="font-display font-extrabold text-[2.15rem] sm:text-5xl lg:text-[3.75rem] text-white tracking-[-0.03em] leading-[1.06]"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: EASE_ATELIER }}
            className="text-[13px] sm:text-base lg:text-lg text-white/85 font-normal leading-relaxed max-w-xl"
          >
            {subtext}
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE_ATELIER }}
            className="flex flex-wrap items-center gap-3.5 pt-1"
          >
            <Link
              href={primaryCtaLink}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[46px] rounded-button bg-primary text-primary-foreground font-bold text-xs sm:text-sm tracking-wide hover:bg-primary-hover transition-all shadow-elevation"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 min-h-[46px] rounded-button border border-white/35 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm tracking-wide transition-all"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
