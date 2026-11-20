"use client";

import React from "react";
import Link from "next/link";
import { Sliders, FileCheck, CheckCircle2, PackageCheck } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

const STEP_ICONS = [Sliders, FileCheck, CheckCircle2, PackageCheck];

export function HowOrderingWorks({
  initialSteps,
}: {
  initialSteps?: Array<{ stepNumber: string; title: string; description: string }>;
}) {
  const settings = useSiteSettings();
  const steps: Array<{ stepNumber: string; title: string; description: string }> =
    settings?.processSteps?.length ? settings.processSteps : initialSteps || [];

  if (steps.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-canvas border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length];
            return (
              <div key={idx} className="h-full">
                <div className="h-full bg-card rounded-card border border-card-border p-6 sm:p-8 shadow-soft antigravity-card flex flex-col justify-between relative group hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-theme bg-primary-pale text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg uppercase tracking-wide text-ink group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {idx > 0 && (
                    <div className="mt-5 pt-2">
                      <Link
                        href={idx === 1 ? "/categories" : "/portfolio"}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-button bg-ink text-canvas hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors"
                      >
                        {idx === 1 ? "Order now" : "Know more!"}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
