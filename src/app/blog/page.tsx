"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function BlogPlaceholderPage() {
  return (
    <div className="py-24 md:py-36 bg-canvas-soft min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-theme bg-primary-pale text-primary mx-auto flex items-center justify-center">
          <BookOpen className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block">
            Iceberg Print Press
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight">
            Blog
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Coming soon. In the next phase, our master printmakers will publish technical guides on paper stocks, foil stamping, and packaging engineering.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
