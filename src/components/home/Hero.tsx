"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { R2_IMAGES } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { AtelierMarquee } from "@/components/ui/MotionPrimitives";

const EASE_ATELIER: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STORY_DURATION_MS = 5500;

interface LookbookSlide {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  image: string;
}

const LOOKBOOK_SLIDES: LookbookSlide[] = [
  {
    id: "packaging",
    index: "01",
    title: "Bespoke Rigid Packaging",
    subtitle: "Soft-touch matte board with precision gold hot-foil.",
    image: R2_IMAGES.heroPackaging,
  },
  {
    id: "cards",
    index: "02",
    title: "600gsm Cotton Cards",
    subtitle: "Deep letterpress debossing and painted edges.",
    image: R2_IMAGES.heroCards,
  },
  {
    id: "apparel",
    index: "03",
    title: "420gsm Branded Apparel",
    subtitle: "Heavyweight brushed fleece with high-density screen print.",
    image: R2_IMAGES.heroApparel,
  },
  {
    id: "stationery",
    index: "04",
    title: "Executive Stationery",
    subtitle: "Embossed hardcover jotters and glazed ceramic mugs.",
    image: R2_IMAGES.heroStationery,
  },
];

export function Hero({ initialSettings }: { initialSettings?: any }) {
  const clientSettings = useSiteSettings();
  const settings = clientSettings || initialSettings;
  const prefersReduced = useReducedMotion();

  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const headline =
    settings?.heroHeadline || "Print That Commands Attention.";
  const subtext =
    settings?.heroSubtext ||
    "Custom rigid boxes, 600gsm foil cards, and heavyweight apparel—crafted in Lagos for brands that refuse to look ordinary.";
  const primaryCtaText = settings?.heroPrimaryCtaText || "Explore Products";
  const primaryCtaLink = settings?.heroPrimaryCtaLink || "#top-selling";

  const goToSlide = useCallback(
    (nextIndex: number) => {
      const total = LOOKBOOK_SLIDES.length;
      const normalized = ((nextIndex % total) + total) % total;
      setDirection(nextIndex > activeSlide ? 1 : -1);
      setActiveSlide(normalized);
    },
    [activeSlide],
  );

  const nextSlide = useCallback(() => {
    goToSlide(activeSlide + 1);
  }, [activeSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(activeSlide - 1);
  }, [activeSlide, goToSlide]);

  useEffect(() => {
    if (isPaused || prefersReduced) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % LOOKBOOK_SLIDES.length);
    }, STORY_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused, prefersReduced]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -45 || info.velocity.x < -300) {
      nextSlide();
    } else if (info.offset.x > 45 || info.velocity.x > 300) {
      prevSlide();
    }
  };

  const current = LOOKBOOK_SLIDES[activeSlide];

  return (
    <>
      <section className="relative bg-canvas overflow-hidden">
        {/* ================= MOBILE: CLEAN INSTAGRAM REELS SWIPE (< lg) ================= */}
        <div
          className="lg:hidden relative w-full h-[78vh] min-h-[520px] max-h-[700px] bg-ink overflow-hidden select-none"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Story Progress Bars */}
          <div className="absolute top-3.5 left-4 right-4 z-30 flex items-center gap-1.5">
            {LOOKBOOK_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`View slide ${idx + 1}: ${slide.title}`}
                className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden cursor-pointer py-1 -my-1 bg-clip-content"
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: idx <= activeSlide ? "100%" : "0%" }}
                />
              </button>
            ))}
          </div>

          {/* Swipeable Photography */}
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={
                prefersReduced
                  ? { opacity: 1 }
                  : { x: direction > 0 ? "100%" : "-100%", opacity: 0.7 }
              }
              animate={{ x: 0, opacity: 1 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { x: direction > 0 ? "-30%" : "30%", opacity: 0.5 }
              }
              transition={{ duration: 0.42, ease: EASE_ATELIER }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                priority
                sizes="100vw"
                className="object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/25 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Subtle Side Tap Controls */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white/90 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white/90 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Minimalist Bottom Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-30 p-6 space-y-4">
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 block">
                {current.index} / 0{LOOKBOOK_SLIDES.length}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-[-0.03em] leading-[1.03]">
                {activeSlide === 0 ? headline : current.title}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2 max-w-sm">
                {activeSlide === 0 ? subtext : current.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={primaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs tracking-wide"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="#studio-customizer"
                className="inline-flex items-center justify-center px-4 py-3 min-h-[44px] rounded-button bg-white/15 backdrop-blur-md text-white font-semibold text-xs tracking-wide"
              >
                Customize Live
              </Link>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP: BREATHABLE EDITORIAL SPLIT (>= lg) ================= */}
        <div className="hidden lg:block py-12 xl:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-12 xl:gap-16 items-center">
              {/* Left: Pure Typography + Single Clean Action Row */}
              <div className="col-span-5 space-y-7">
                <motion.h1
                  initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_ATELIER }}
                  className="font-display font-extrabold text-5xl xl:text-[4rem] text-ink tracking-[-0.04em] leading-[0.98]"
                >
                  {headline}
                </motion.h1>

                <motion.p
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08, ease: EASE_ATELIER }}
                  className="text-base text-ink-body font-normal leading-relaxed max-w-md"
                >
                  {subtext}
                </motion.p>

                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.16, ease: EASE_ATELIER }}
                  className="flex items-center gap-6 pt-2"
                >
                  <Link
                    href={primaryCtaLink}
                    className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-button bg-primary text-primary-foreground font-bold text-xs tracking-wider uppercase hover:bg-primary-hover transition-all shadow-elevation"
                  >
                    <span>{primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="#studio-customizer"
                    className="group inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:text-primary transition-colors py-2 border-b border-ink/25 hover:border-primary"
                  >
                    <span>Live Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              </div>

              {/* Right: Clean Floating Editorial Lookbook Card */}
              <div
                className="col-span-7"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative h-[560px] w-full rounded-card overflow-hidden bg-ink shadow-elevation select-none group">
                  {/* Top Story Progress Bars */}
                  <div className="absolute top-4 left-5 right-5 z-30 flex items-center gap-2">
                    {LOOKBOOK_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        aria-label={`View slide ${idx + 1}: ${slide.title}`}
                        className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden cursor-pointer py-1 -my-1 bg-clip-content"
                      >
                        <div
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: idx <= activeSlide ? "100%" : "0%" }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Swipeable Image Stage */}
                  <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <motion.div
                      key={current.id}
                      custom={direction}
                      initial={
                        prefersReduced
                          ? { opacity: 1 }
                          : { x: direction > 0 ? "100%" : "-100%", opacity: 0.7 }
                      }
                      animate={{ x: 0, opacity: 1 }}
                      exit={
                        prefersReduced
                          ? { opacity: 0 }
                          : { x: direction > 0 ? "-30%" : "30%", opacity: 0.5 }
                      }
                      transition={{ duration: 0.45, ease: EASE_ATELIER }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.16}
                      onDragEnd={handleDragEnd}
                      className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                      <Image
                        src={current.image}
                        alt={current.title}
                        fill
                        priority
                        sizes="(max-width: 1280px) 55vw, 680px"
                        className="object-cover pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/25 pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Hover Prev / Next Controls */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="pointer-events-auto w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="pointer-events-auto w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Minimal Bottom Caption */}
                  <div className="absolute bottom-6 left-6 right-6 z-30 flex items-end justify-between gap-4 text-white pointer-events-none">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-white leading-tight">
                        {current.title}
                      </h2>
                      <p className="text-xs text-white/80 mt-1">
                        {current.subtitle}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-white/75 shrink-0">
                      {current.index} / 0{LOOKBOOK_SLIDES.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AtelierMarquee />
    </>
  );
}
