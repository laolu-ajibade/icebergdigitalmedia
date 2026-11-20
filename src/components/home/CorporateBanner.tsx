"use client";

import React from "react";
import { Check, MessageSquare, Phone } from "lucide-react";
import { CONTACT_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { RegistrationMarks, RevealBlock } from "@/components/ui/MotionPrimitives";

export function CorporateBanner() {
  const settings = useSiteSettings();

  const headline =
    settings?.corporateHeadline ||
    "Big Order or a Full Brand Rollout Across Nigeria?";
  const subtext =
    settings?.corporateSubtext ||
    "Send us your quantities and specifications for souvenirs, annual corporate gifts, branch signage, packaging boxes, or national event branding. Our Shomolu central factory serves the entire commercial scope with contractual SLA terms.";
  const perks: string[] = settings?.corporatePerks || [];
  const phone = settings?.phone || CONTACT_PHONE;
  const whatsapp =
    (settings?.whatsappRouting || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;

  return (
    <section className="py-12 sm:py-16 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealBlock>
          <div className="bg-ink text-canvas-soft rounded-card p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-elevation border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                B2B & Enterprise Print Procurement
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
                {headline}
              </h2>
              <p className="text-xs sm:text-sm text-canvas-soft/80 mt-3 leading-relaxed">
                {subtext}
              </p>

              <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 mt-6">
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                    "Hello Iceberg Studio, I would like to discuss a corporate brand rollout or bulk order."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Request Corporate Quote</span>
                </a>

                <a
                  href={`tel:${whatsapp}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-button bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Direct Desk: {phone}</span>
                </a>
              </div>
            </div>

            {perks.length > 0 && (
              <div className="bg-white/5 rounded-theme p-4 sm:p-6 border border-white/10 space-y-3">
                <h3 className="font-display font-bold text-sm text-white border-b border-white/10 pb-2.5">
                  Corporate Contract Benefits
                </h3>
                <div className="space-y-3">
                  {perks.map((perk, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-xs text-canvas-soft/90 leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-theme bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
