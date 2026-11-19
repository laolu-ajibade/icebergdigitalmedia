"use client";

import React from "react";
import { Sliders, FileCheck, CheckCircle2, PackageCheck } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

const STEP_ICONS = [Sliders, FileCheck, CheckCircle2, PackageCheck];

export function HowOrderingWorks() {
  const settings = useSiteSettings();
  const steps: Array<{ stepNumber: string; title: string; description: string }> =
    settings?.processSteps || [];

  if (steps.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 md:py-24 bg-canvas border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
            How Ordering Works at Iceberg Studio
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-ink-muted mt-3">
            One-frictionless commercial ordering flow: design calibration to factory dispatch proofing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length];
            return (
              <div
                key={idx}
                className="bg-card rounded-card border border-card-border p-5 sm:p-8 shadow-soft antigravity-card flex flex-col justify-between relative group hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-black text-3xl text-primary/40 group-hover:text-primary transition-colors">
                      {step.stepNumber || `0${idx + 1}`}
                    </span>
                    <div className="w-10 h-10 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-ink-body leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
