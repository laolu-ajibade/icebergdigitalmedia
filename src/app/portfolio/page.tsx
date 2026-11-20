import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Settings, Briefcase, Zap, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { R2_IMAGES } from "@/lib/constants";
import { PortfolioShowcase } from "@/components/home/PortfolioShowcase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies",
  description:
    "Explore commercial digital printing, bespoke rigid packaging, branded apparel, and corporate identity work by Iceberg Creative Print Studio.",
};

const TIMELINE_STEPS = [
  {
    num: "01",
    title: "Planning",
    desc: "We align on paper stock, dimensions, foil finishes, and quantity targets.",
  },
  {
    num: "02",
    title: "Designing",
    desc: "Pre-press artwork calibration, dielines, and digital proof sign-off.",
  },
  {
    num: "03",
    title: "Production",
    desc: "Calibrated CMYK printing, hot-foil stamping, and precision die-cutting.",
  },
  {
    num: "04",
    title: "Delivery",
    desc: "Quality inspection and express dispatch across Lagos and all 36 states.",
  },
];

export default async function PortfolioPage() {
  let settings: any = null;
  let products: any[] = [];
  let categories: any[] = [];

  try {
    await connectDB();
    const [s, p, c] = await Promise.all([
      SiteSettings.findOne().lean(),
      Product.find().sort({ isTopSelling: -1, createdAt: -1 }).limit(40).lean(),
      Category.find().sort({ order: 1 }).limit(10).lean(),
    ]);
    settings = s ? JSON.parse(JSON.stringify(s)) : null;
    products = JSON.parse(JSON.stringify(p || []));
    categories = JSON.parse(JSON.stringify(c || []));
  } catch {
    // Graceful fallback
  }

  const companyName = settings?.companyName || "Iceberg Creative Print Studio";
  const headline =
    settings?.portfolioPageHeadline || "Creativity as it speaks excellence!";
  const words = headline.trim().split(" ");
  const firstWord = words[0] || "";
  const restWords = words.slice(1).join(" ");

  const subtext =
    settings?.portfolioPageSubtext ||
    "We transform your perception into remarkable Creative Branding, Graphic Design, Packaging, and Commercial Digital Printing.";

  const projectTitle =
    settings?.portfolioProjectTitle ||
    "Start a new project with us and start adventure together!";
  const projectDesc =
    settings?.portfolioProjectDesc ||
    "Digital Printing Service, Creative Branding, Graphic Design and Packaging in Lagos Nigeria.";
  const projectChecks: string[] =
    Array.isArray(settings?.portfolioProjectChecks) &&
    settings.portfolioProjectChecks.length > 0
      ? settings.portfolioProjectChecks
      : [
          "Bespoke Rigid Packaging",
          "600gsm Foil Business Cards",
          "Brand Identity & Guidelines",
          "Commercial Digital Printing",
        ];

  const solutionTitle = settings?.portfolioSolutionTitle || "Our Solution";
  const solutionDesc =
    settings?.portfolioSolutionDesc ||
    "We craft tactile brand collateral, commercial packaging, and studio-grade print systems.";
  const solutionChecks: string[] =
    Array.isArray(settings?.portfolioSolutionChecks) &&
    settings.portfolioSolutionChecks.length > 0
      ? settings.portfolioSolutionChecks
      : [
          "Proven results & calibrated CMYK print precision",
          "Deep expertise in paper stocks, foil & finishing",
          "Dedicated creative direction & pre-press proofing",
          "Same-day Lagos dispatch & 36-state delivery",
        ];

  const defaultImages = [
    R2_IMAGES.stationerySet,
    R2_IMAGES.customPackaging,
    R2_IMAGES.cups,
    R2_IMAGES.clothes,
    R2_IMAGES.stickersLabels,
  ];
  const savedImgs: string[] = Array.isArray(settings?.portfolioImages)
    ? settings.portfolioImages
    : [];
  const imgs = defaultImages.map((def, i) => savedImgs[i] || def);

  return (
    <div className="bg-canvas">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">Portfolio</span>
        </div>
      </div>

      {/* Centered Editorial Intro */}
      <section className="py-12 sm:py-16 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight leading-[1.08]">
            {restWords ? (
              <>
                <span className="text-ink-muted font-bold">{firstWord}</span>{" "}
                {restWords}
              </>
            ) : (
              headline
            )}
          </h1>
          <p className="text-[11px] font-mono uppercase tracking-widest text-ink-muted">
            {companyName}
          </p>
          <p className="text-xs sm:text-sm text-ink-body max-w-xl mx-auto leading-relaxed pt-1">
            {subtext}
          </p>
        </div>
      </section>

      {/* Block 1: 3 Stacked Images Left + Sticky Content Right */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              {imgs.slice(0, 3).map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-64 sm:h-80 w-full rounded-card overflow-hidden border border-card-border shadow-soft antigravity-card bg-canvas-soft"
                >
                  <Image
                    src={src}
                    alt={`${projectTitle} - ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-4 lg:pt-4">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight leading-snug">
                {projectTitle}
              </h2>
              <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                {projectDesc}
              </p>
              <ul className="space-y-2.5 pt-2">
                {projectChecks.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-ink font-medium"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-colors"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2: Sticky Content Left + 2 Stacked Images Right */}
      <section className="py-12 sm:py-16 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-4 order-2 lg:order-1 lg:pt-4">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight leading-snug">
                {solutionTitle}
              </h2>
              <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                {solutionDesc}
              </p>
              <ul className="space-y-2.5 pt-2">
                {solutionChecks.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-ink font-medium"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              {imgs.slice(3, 5).map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-64 sm:h-80 w-full rounded-card overflow-hidden border border-card-border shadow-soft antigravity-card bg-canvas-soft"
                >
                  <Image
                    src={src}
                    alt={`${solutionTitle} - ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Support & Value Strip */}
      <section className="py-14 sm:py-16 bg-canvas border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2.5">
              <Settings className="w-7 h-7 text-ink" />
              <h3 className="font-display font-bold text-lg text-ink">
                Dedicated Production
              </h3>
              <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                Precision digital and offset press engineering tailored to help ambitious brands stand out.
              </p>
            </div>
            <div className="space-y-2.5">
              <Briefcase className="w-7 h-7 text-ink" />
              <h3 className="font-display font-bold text-lg text-ink">
                Friendly Support
              </h3>
              <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                Our studio team guides you from dieline setup and paper selection through final press sign-off.
              </p>
            </div>
            <div className="space-y-2.5">
              <Zap className="w-7 h-7 text-ink" />
              <h3 className="font-display font-bold text-lg text-ink">
                Instant Solutions
              </h3>
              <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                Live pricing, real-time mockup proofing, and direct WhatsApp press-desk turnaround.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Timeline with Connecting Line */}
      <section className="py-14 sm:py-16 bg-canvas-soft border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-5 left-[12%] right-[12%] h-px bg-border"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
              {TIMELINE_STEPS.map((step) => (
                <div key={step.num} className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-ink text-canvas font-mono text-xs font-bold flex items-center justify-center mx-auto shadow-soft">
                    {step.num}
                  </div>
                  <h4 className="font-display font-bold text-base text-ink">
                    {step.title}
                  </h4>
                  <p className="text-xs text-ink-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filterable Portfolio & Product Catalog */}
      <PortfolioShowcase
        initialProducts={products}
        initialCategories={categories}
        initialSettings={settings}
      />
    </div>
  );
}
