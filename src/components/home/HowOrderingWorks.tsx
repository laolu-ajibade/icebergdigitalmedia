"use client";

import React from "react";
import { Sliders, FileCheck, CheckCircle2, PackageCheck } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { RevealBlock, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

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
    <section className="py-16 md:py-24 bg-canvas border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-border/60">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-[1.05]">
              How Ordering Works at Iceberg Studio
            </h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-ink-muted max-w-md leading-relaxed">
            One frictionless commercial ordering flow: design calibration to factory dispatch proofing.
          </p>
        </RevealBlock>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length];
            return (
              <StaggerItem key={idx} className="h-full">
                <div className="h-full bg-card rounded-card border border-card-border p-6 sm:p-8 shadow-soft antigravity-card flex flex-col justify-between relative group hover:border-primary/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
                      <span className="font-display font-extrabold text-4xl text-ink/20 group-hover:text-primary transition-colors tabular-nums">
                        {step.stepNumber || `0${idx + 1}`}
                      </span>
                      <div className="w-10 h-10 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-xl text-ink mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
