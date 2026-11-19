"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What artwork file formats do you accept?",
      a: "We recommend print-ready PDF, Adobe Illustrator (.AI), or high-resolution vector EPS files in CMYK color mode at 300 DPI with 3mm bleed on all sides. We also accept high-resolution PNG or TIFF files (300 DPI). Our in-house studio team performs a complimentary pre-flight check before printing.",
    },
    {
      q: "Can I inspect a sample or physical proof before mass production?",
      a: "Yes. For every order, we issue a calibrated digital PDF proof for approval. For large corporate rollouts, bulk merchandise, or rigid box packaging, we provide physical factory sample proofs dispatched to your Lagos office before commencing full production.",
    },
    {
      q: "How fast can I receive my order in Lagos and nationwide?",
      a: "Standard digital prints (business cards, flyers, roll-up banners) are dispatched within 24 to 48 hours. Orders within Lagos are delivered on the same day via Kwik or Bolt Logistics. Regional orders across Abuja, Port Harcourt, and all 36 states arrive within 48 to 72 hours via GIG Logistics.",
    },
    {
      q: "How do volume discounts work on custom printing?",
      a: "Commercial printing involves initial plate and press setup costs. As your quantity increases, the setup cost amortizes across more units, substantially lowering the cost per piece. Our Instant Estimator displays live tiered pricing for every quantity threshold.",
    },
    {
      q: "Can you help design our print collateral if we don't have artwork?",
      a: "Absolutely. Our in-house creative design studio in Shomolu specializes in corporate identity, typography calibration, packaging dielines, and 3D mockups. Simply contact our WhatsApp desk to brief our design specialists.",
    },
  ];

  return (
    <section id="faq-section" className="py-16 md:py-24 bg-canvas border-b border-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-primary block mb-2">
            Frequently Asked Questions
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
            Commercial Print & Production Specifications
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            Essential information on proofing, turnaround times, file specs, and logistics.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-card rounded-card border border-border/80 overflow-hidden shadow-soft transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-canvas-soft/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-sm md:text-base text-ink">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-body leading-relaxed border-t border-border/40 bg-canvas-soft/30 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
