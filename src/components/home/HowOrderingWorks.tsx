"use client";

import React from "react";
import { Sliders, FileCheck, CheckCircle2 } from "lucide-react";

export function HowOrderingWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose Product & Volume Tier",
      description:
        "The factory price updates dynamically as you adjust quantity tiers. Volume discounts apply automatically to decrease unit cost.",
      icon: Sliders,
      highlight: "Real-time cost calculator",
    },
    {
      number: "02",
      title: "Upload Design or Request Studio Proofing",
      description:
        "Submit your print-ready PDF/AI files (CMYK, 300 DPI, 3mm bleed). Our pre-press specialists calibrate registration before mass printing.",
      icon: FileCheck,
      highlight: "Complimentary pre-press check",
    },
    {
      number: "03",
      title: "Approve, Confirm & Receive",
      description:
        "Approve your digital proof, confirm order specifications on WhatsApp, and receive via Kwik, Bolt, or GIG Logistics nationwide.",
      icon: CheckCircle2,
      highlight: "Trackable dispatch across 36 states",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-canvas border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-primary block mb-2">
            Process Transparency
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
            How Ordering Works at Iceberg Studio
          </h2>
          <p className="text-sm md:text-base text-ink-muted mt-3">
            One-frictionless commercial ordering flow: design calibration to factory dispatch proofing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-card rounded-card border border-border/80 p-8 shadow-soft antigravity-card flex flex-col justify-between relative group hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-black text-3xl text-primary/40 group-hover:text-primary transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs text-ink-body leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 text-[11px] font-semibold text-primary">
                  {step.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
