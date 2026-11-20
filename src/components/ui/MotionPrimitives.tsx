"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useSiteSettings } from "@/lib/useSiteSettings";

const EASE_ATELIER: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function RevealBlock({
  children,
  className = "",
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: EASE_ATELIER }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const gridContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: EASE_ATELIER,
    },
  },
};

export function StaggerGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={gridItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Authentic commercial print-press registration crop marks for framing studio proofs.
 */
export function RegistrationMarks({
  className = "text-ink/25",
}: {
  className?: string;
}) {
  const mark = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none select-none"
    >
      <path d="M7 0V14M0 7H14" stroke="currentColor" strokeWidth="1" />
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );

  return (
    <>
      <span className={`absolute top-3 left-3 ${className}`}>{mark}</span>
      <span className={`absolute top-3 right-3 ${className}`}>{mark}</span>
      <span className={`absolute bottom-3 left-3 ${className}`}>{mark}</span>
      <span className={`absolute bottom-3 right-3 ${className}`}>{mark}</span>
    </>
  );
}

const CAPABILITIES = [
  "600GSM COTTON BOARDS",
  "METALLIC FOIL STAMPING",
  "BESPOKE RIGID PACKAGING",
  "CALIBRATED CMYK PRESS",
  "DIRECT-TO-GARMENT FLEECE",
  "24–48HR LAGOS DISPATCH",
  "36 STATES DELIVERY",
  "SHOMOLU ATELIER",
];

export function AtelierMarquee() {
  const settings = useSiteSettings();
  const items: string[] = Array.isArray(settings?.marqueeItems)
    ? settings.marqueeItems.filter((s: string) => typeof s === "string" && s.trim().length > 0)
    : CAPABILITIES;

  if (items.length === 0) return null;

  return (
    <div
      className="w-full overflow-hidden bg-ink text-canvas-soft border-y border-border/20 py-3 select-none"
      aria-label="Studio print capabilities"
    >
      <div className="flex w-max animate-atelier-marquee motion-reduce:animate-none">
        {[0, 1].map((loop) => (
          <div key={loop} className="flex items-center shrink-0">
            {items.map((item, i) => (
              <div key={`${loop}-${i}`} className="flex items-center">
                <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase px-6 text-canvas-soft/90 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-primary font-mono text-xs" aria-hidden="true">
                  /
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
