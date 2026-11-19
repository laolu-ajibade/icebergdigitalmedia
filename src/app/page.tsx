import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TopSellingProducts } from "@/components/home/TopSellingProducts";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowOrderingWorks } from "@/components/home/HowOrderingWorks";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { CorporateBanner } from "@/components/home/CorporateBanner";
import { StatsSection } from "@/components/home/StatsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { FaqSection } from "@/components/home/FaqSection";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { Review } from "@/models/Review";
import { SITE_URL, CONTACT_PHONE, R2_IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Iceberg Creative Print Studio | Commercial Printing & Bespoke Packaging in Lagos",
  description:
    "Order custom luxury business cards, rigid packaging boxes, branded apparel, ceramic mugs, spiral jotters, and exhibition roll-up banners in Shomolu, Lagos with nationwide delivery across Nigeria.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  let localBusinessJsonLd: Record<string, any> | null = null;
  let faqJsonLd: Record<string, any> | null = null;

  try {
    await connectDB();
    const [settings, reviews] = await Promise.all([
      SiteSettings.findOne().lean() as Promise<any>,
      Review.find({ featured: true }, { rating: 1 }).lean() as Promise<any[]>,
    ]);

    const reviewCount = reviews?.length || 9;
    const avgRating =
      reviewCount > 0
        ? Number(
            (
              reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
              reviewCount
            ).toFixed(1),
          )
        : 5.0;

    localBusinessJsonLd = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: settings?.companyName || "Iceberg Creative Print Studio",
      description:
        settings?.heroSubtext ||
        "Commercial digital printing press and bespoke packaging studio in Shomolu, Lagos, Nigeria.",
      url: SITE_URL,
      image: R2_IMAGES.boxes,
      telephone: settings?.phone || CONTACT_PHONE,
      email: settings?.email || "digitalmedia@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          settings?.address || "25, Akeju Street, Off Apata Street, Shomolu",
        addressLocality: "Shomolu",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
      areaServed: "NG",
      priceRange: "₦₦",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue:
          settings?.reviewsOverallRating > 0
            ? settings.reviewsOverallRating
            : avgRating,
        reviewCount,
      },
    };

    if (Array.isArray(settings?.faqs) && settings.faqs.length > 0) {
      faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: settings.faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
    }
  } catch {
    // Graceful fallback if DB is temporarily unavailable during static pre-render
  }

  return (
    <>
      {localBusinessJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}
      <Hero />
      <TopSellingProducts />
      <CategoryGrid />
      <HowOrderingWorks />
      <GoogleReviews />
      <CorporateBanner />
      <StatsSection />
      <AboutSection />
      <BlogPreview />
      <FaqSection />
    </>
  );
}
