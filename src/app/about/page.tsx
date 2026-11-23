import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { Product } from "@/models/Product";
import { R2_IMAGES } from "@/lib/constants";
import { TeamSection } from "@/components/home/TeamSection";
import { CollageInquirySection } from "@/components/home/CollageInquirySection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Iceberg Creative Print Studio in Shomolu, Lagos — our craftsmanship, commercial printing capabilities, and client testimonials.",
};

export default async function AboutPage() {
  let settings: any = null;
  let products: any[] = [];

  try {
    await connectDB();
    const [s, p] = await Promise.all([
      SiteSettings.findOne().lean() as Promise<any>,
      Product.find().sort({ isTopSelling: -1, createdAt: -1 }).limit(9).lean() as Promise<any[]>,
    ]);
    settings = s ? JSON.parse(JSON.stringify(s)) : null;
    products = JSON.parse(JSON.stringify(p || []));
  } catch {
    // Graceful fallback
  }

  const companyName = settings?.companyName || "Iceberg Studio";
  const tagline = settings?.tagline || "Creativity as it speaks excellence!";
  const portraitImage = settings?.aboutImage || R2_IMAGES.founderPortrait;
  const founderName = settings?.aboutFounderName || companyName;
  const founderBio =
    settings?.aboutFounderBio ||
    "Founded in Shomolu, Lagos — blending mechanical press craftsmanship with modern design direction.";
  const story =
    settings?.aboutStory ||
    "Rooted in the historic printmaking hub of Shomolu, Lagos, Iceberg Creative Print Studio blends time-tested mechanical craftsmanship with next-generation digital printing technologies.";

  const skills: Array<{ label: string; percentage: number }> =
    Array.isArray(settings?.aboutSkills) && settings.aboutSkills.length > 0
      ? settings.aboutSkills
      : [
          { label: "Commercial Digital & Offset Printing", percentage: 96 },
          { label: "Bespoke Rigid Packaging & Foil", percentage: 94 },
          { label: "Brand Identity & Graphic Design", percentage: 92 },
          { label: "Heavyweight Apparel & Merch", percentage: 95 },
        ];

  const mosaicItems = products.slice(0, 9);

  return (
    <div className="bg-canvas">
      {/* Split Studio Showcase (Sticky Portrait Left + Content Right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">About Us</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Portrait */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="relative h-[420px] sm:h-[560px] w-full rounded-card overflow-hidden border border-card-border shadow-elevation bg-ink">
              <Image
                src={portraitImage}
                alt={founderName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="font-display font-bold text-2xl text-white">
                  {founderName}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed">
                  {founderBio}
                </p>
              </div>
            </div>
          </div>

          {/* Right Editorial Column */}
          <div className="lg:col-span-7 space-y-12">
            {/* Heading & Story */}
            <div className="space-y-3">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                About Us | {companyName}
              </h1>
              <p className="text-sm font-semibold text-primary">{tagline}</p>
              <p className="text-sm text-ink-body leading-relaxed pt-2 whitespace-pre-line">
                {story}
              </p>
            </div>

            {/* 3x3 Visual Work Mosaic */}
            {mosaicItems.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {mosaicItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/product/${item.slug}`}
                    className="relative aspect-[4/3] rounded-theme overflow-hidden border border-card-border bg-canvas-soft group"
                  >
                    <Image
                      src={
                        (item.gallery && item.gallery[0]) ||
                        item.image ||
                        R2_IMAGES.boxes
                      }
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 18vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* Professional Skills Progress Bars */}
            <div className="space-y-6 pt-2">
              <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-ink">
                    Our Professional Capabilities
                  </h2>
                  <p className="text-xs text-ink-muted mt-1">
                    Calibrated production expertise across digital press, packaging, and brand design.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover transition-colors shrink-0"
                >
                  <span>Work With Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-5">
                {skills.map((skill, idx) => {
                  const pct = Math.min(100, Math.max(0, Number(skill.percentage) || 90));
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-ink">
                        <span>{skill.label}</span>
                        <span className="font-mono text-ink-muted tabular-nums">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-canvas-muted overflow-hidden">
                        <div
                          className="h-full bg-ink rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeamSection initialSettings={settings} />
      <CollageInquirySection initialSettings={settings} />
    </div>
  );
}
