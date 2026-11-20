"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { R2_IMAGES, WHATSAPP_NUMBER } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function CollageInquirySection({
  initialSettings,
}: {
  initialSettings?: any;
}) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;

  const [emailOrNote, setEmailOrNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const statTitle =
    settings?.collageStatTitle ||
    "We Complete 1,000+ Print Orders Every Year";
  const statSubtext =
    settings?.collageStatSubtext ||
    "Trusted by brands and businesses across Nigeria.";
  const collageImages: string[] =
    Array.isArray(settings?.collageImages) && settings.collageImages.length >= 3
      ? settings.collageImages
      : [
          R2_IMAGES.heroApparel,
          R2_IMAGES.heroCards,
          R2_IMAGES.heroStationery,
        ];
  const inquiryHeadline =
    settings?.inquiryHeadline || "Need a Print Quote?";
  const inquirySubtext =
    settings?.inquirySubtext ||
    "Send us a quick message or view our portfolio to get started.";
  const whatsapp =
    (settings?.whatsappRouting || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrNote.trim()) return;
    setSubmitted(true);
    const msg = `Hello Iceberg Studio, here is my email / quick inquiry: ${emailOrNote.trim()}`;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setEmailOrNote("");
  };

  return (
    <section className="py-16 md:py-24 bg-canvas border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: 2x2 Asymmetric Editorial Collage */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Top-left photo */}
              <div className="relative h-44 sm:h-52 rounded-card overflow-hidden border border-card-border shadow-soft antigravity-card">
                <Image
                  src={collageImages[0]}
                  alt="Iceberg Branded Apparel Print"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              {/* Top-right photo */}
              <div className="relative h-44 sm:h-52 rounded-card overflow-hidden border border-card-border shadow-soft antigravity-card">
                <Image
                  src={collageImages[1]}
                  alt="Iceberg 600gsm Cotton Business Cards"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              {/* Bottom-left dark callout card */}
              <div className="h-44 sm:h-52 rounded-card bg-ink text-white p-5 sm:p-6 flex flex-col justify-between shadow-elevation border border-white/10 antigravity-card">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Our goal:
                </span>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg leading-snug text-white">
                    {statTitle}
                  </h3>
                  <p className="text-[11px] text-white/70 mt-1.5 leading-relaxed line-clamp-2">
                    {statSubtext}
                  </p>
                </div>
              </div>

              {/* Bottom-right photo */}
              <div className="relative h-44 sm:h-52 rounded-card overflow-hidden border border-card-border shadow-soft antigravity-card">
                <Image
                  src={collageImages[2]}
                  alt="Iceberg Executive Stationery"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Clean Studio Inquiry & Quote Desk */}
          <div className="lg:col-span-6 lg:pl-6">
            <div className="bg-canvas-soft/60 sm:bg-transparent border border-border/70 sm:border-0 rounded-card p-5 sm:p-0 space-y-4 sm:space-y-5">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight leading-tight">
                {inquiryHeadline}
              </h2>
              <p className="text-xs sm:text-base text-ink-body leading-relaxed max-w-lg">
                {inquirySubtext}
              </p>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 min-h-[44px] rounded-button border border-ink text-ink hover:bg-ink hover:text-canvas font-semibold text-xs transition-colors"
                >
                  Contact us
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 min-h-[44px] rounded-button bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs transition-colors shadow-soft"
                >
                  View Portfolio
                </Link>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2 max-w-lg"
              >
                <input
                  type="text"
                  required
                  value={emailOrNote}
                  onChange={(e) => {
                    setEmailOrNote(e.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                  placeholder="Enter your email or print request..."
                  className="flex-1 px-4 py-3 min-h-[46px] rounded-theme bg-card sm:bg-canvas-soft border border-border text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-button bg-ink hover:bg-primary text-canvas hover:text-primary-foreground font-bold text-xs tracking-wide transition-colors shadow-soft cursor-pointer shrink-0"
                >
                  <span>Send Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {submitted && (
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Opening our Shomolu Press WhatsApp desk with your inquiry.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
