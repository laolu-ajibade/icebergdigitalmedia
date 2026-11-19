"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  heightClass?: string;
  showThumbnails?: boolean;
  overlayText?: string;
}

export function ProductImageCarousel({
  images,
  alt,
  heightClass = "h-60",
  showThumbnails = false,
  overlayText,
}: ProductImageCarouselProps) {
  const validImages = images && images.length > 0 ? images.filter(Boolean) : ["/logo-icon.jpg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40 && validImages.length > 1) {
      if (deltaX < 0) {
        setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
      } else {
        setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="space-y-3">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full ${heightClass} bg-canvas-soft overflow-hidden select-none group/carousel`}
      >
        <Image
          src={validImages[activeIndex] || validImages[0]}
          alt={`${alt} - View ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500"
        />

        {overlayText && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-theme bg-ink/80 text-white text-[11px] font-semibold backdrop-blur-xs z-10">
            {overlayText}
          </div>
        )}

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous product image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-button bg-card/85 hover:bg-card text-ink border border-border/70 shadow-soft flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next product image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-button bg-card/85 hover:bg-card text-ink border border-border/70 shadow-soft flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-theme bg-ink/75 text-white text-[10px] font-mono font-semibold backdrop-blur-xs z-10">
              {activeIndex + 1} / {validImages.length}
            </div>
          </>
        )}
      </div>

      {showThumbnails && validImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {validImages.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-theme overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-canvas-soft ${
                activeIndex === idx
                  ? "border-primary shadow-soft"
                  : "border-border/70 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
