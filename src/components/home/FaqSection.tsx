"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const settings = useSiteSettings();
  const faqs: Array<{ question: string; answer: string }> =
    settings?.faqs || [];

  if (faqs.length === 0) return null;

  return (
    <section
      id="faq-section"
      className="py-16 md:py-24 bg-canvas border-b border-border/40"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
            Commercial Print & Production Specifications
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            Essential information on proofing, delivery times, file specs, and
            logistics.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-card rounded-card border border-card-border overflow-hidden shadow-soft transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-canvas-soft/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-sm md:text-base text-ink">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-body leading-relaxed border-t border-border/40">
                    <p>{faq.answer}</p>
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
