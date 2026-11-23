import type { Metadata } from "next";
import Link from "next/link";
import { LivePrintCanvas } from "@/components/home/LivePrintCanvas";
import { HowOrderingWorks } from "@/components/home/HowOrderingWorks";
import { RevealBlock } from "@/components/ui/MotionPrimitives";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { initialSiteSettings } from "@/lib/seed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brand Studio",
  description:
    "Upload your logo, test colors and finishes on custom packaging, apparel, mugs, and stationery, and get an instant print production estimate in Lagos.",
  alternates: {
    canonical: "/brand-studio",
  },
};

export default async function BrandStudioPage() {
  let initialSteps = initialSiteSettings.processSteps || [];

  try {
    await connectDB();
    const settings = (await SiteSettings.findOne(
      {},
      { processSteps: 1 },
    ).lean()) as {
      processSteps?: Array<{
        stepNumber: string;
        title: string;
        description: string;
      }>;
    } | null;

    if (Array.isArray(settings?.processSteps) && settings.processSteps.length > 0) {
      initialSteps = settings.processSteps.map(step => ({
        stepNumber: String(step.stepNumber || ""),
        title: String(step.title || ""),
        description: String(step.description || ""),
      }));
    }
  } catch {
    // Fall back to seeded steps when DB is unavailable
  }

  return (
    <div className="bg-canvas min-h-screen">
      <section className="py-10 md:py-16 bg-canvas-soft atelier-grid-bg border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">Brand Studio</span>
          </div>

          <RevealBlock className="mb-8 md:mb-10 max-w-2xl">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-[1.08]">
              See Your Brand on Real Print Before You Order
            </h1>
            <p className="text-sm md:text-base text-ink-body mt-3 leading-relaxed">
              Upload your logo, test colors and finishes, and get an instant production estimate in seconds.
            </p>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <LivePrintCanvas />
          </RevealBlock>
        </div>
      </section>

      <HowOrderingWorks initialSteps={initialSteps} />
    </div>
  );
}
