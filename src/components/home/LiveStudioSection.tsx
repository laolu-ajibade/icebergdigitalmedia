"use client";

import React from "react";
import { LivePrintCanvas } from "./LivePrintCanvas";
import { RevealBlock } from "@/components/ui/MotionPrimitives";

export function LiveStudioSection() {
  return (
    <section
      id="studio-customizer"
      className="py-16 md:py-24 bg-canvas-soft atelier-grid-bg border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealBlock className="mb-8 md:mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-[1.05]">
            Customize Your Brand Live
          </h2>
          <p className="text-sm md:text-base text-ink-muted mt-2.5 max-w-xl leading-relaxed">
            Upload your logo, test colors, and preview your print run in real time.
          </p>
        </RevealBlock>

        <RevealBlock delay={0.1}>
          <LivePrintCanvas />
        </RevealBlock>
      </div>
    </section>
  );
}
