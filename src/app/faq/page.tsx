import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { initialSiteSettings } from "@/lib/seed";
import { FaqSection } from "@/components/home/FaqSection";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Quick answers on print turnaround times, artwork proofing, minimum order quantities, and nationwide delivery from Iceberg Creative Print Studio in Lagos.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Iceberg Creative Print Studio",
    description:
      "Answers on delivery times, artwork proofing, bulk print orders, and bespoke packaging in Lagos, Nigeria.",
    url: `${SITE_URL}/faq`,
    type: "website",
  },
};

export default async function FaqPage() {
  let initialFaqs: Array<{ question: string; answer: string }> =
    initialSiteSettings.faqs || [];

  try {
    await connectDB();
    const settings = (await SiteSettings.findOne({}, { faqs: 1 }).lean()) as {
      faqs?: Array<{ question: string; answer: string }>;
    } | null;

    if (Array.isArray(settings?.faqs) && settings.faqs.length > 0) {
      initialFaqs = settings.faqs.map(faq => ({
        question: String(faq.question || ""),
        answer: String(faq.answer || ""),
      }));
    }
  } catch {
    // Fall back to seeded FAQs if DB is temporarily unavailable
  }

  const faqJsonLd =
    initialFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: initialFaqs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}
      <FaqSection initialFaqs={initialFaqs} />
    </>
  );
}
