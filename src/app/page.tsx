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
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Blog } from "@/models/Blog";
import { SITE_URL, CONTACT_PHONE, R2_IMAGES } from "@/lib/constants";

export const dynamic = "force-dynamic";

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
  let initialProducts: any[] = [];
  let initialCategories: any[] = [];
  let initialFaqs: Array<{ question: string; answer: string }> = [];
  let initialSettings: any = null;
  let initialBlogs: any[] = [];

  try {
    await connectDB();
    const [settings, reviews, products, categories, blogs] = await Promise.all([
      SiteSettings.findOne().lean() as Promise<any>,
      Review.find({ featured: true }, { rating: 1 }).lean() as Promise<any[]>,
      Product.find({ isTopSelling: true }).sort({ createdAt: -1 }).limit(6).lean() as Promise<any[]>,
      Category.find().sort({ order: 1 }).limit(10).lean() as Promise<any[]>,
      Blog.find({ published: { $ne: false } }).sort({ publishedAt: -1 }).limit(2).lean() as Promise<any[]>,
    ]);

    initialSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;
    initialProducts = JSON.parse(JSON.stringify(products || []));
    initialCategories = JSON.parse(JSON.stringify(categories || []));
    initialBlogs = JSON.parse(JSON.stringify(blogs || []));
    initialFaqs = Array.isArray(settings?.faqs)
      ? JSON.parse(JSON.stringify(settings.faqs))
      : [];

    const socialLinks = [
      settings?.instagramUrl,
      settings?.facebookUrl,
      settings?.twitterUrl,
      settings?.linkedinUrl,
      settings?.youtubeUrl,
      settings?.tiktokUrl,
    ].filter((u) => typeof u === "string" && u.startsWith("http"));

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
      email: settings?.email || "hello@icebergprints.com",
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
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
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
      <Hero initialSettings={initialSettings} />
      <TopSellingProducts initialProducts={initialProducts} />
      <CategoryGrid initialCategories={initialCategories} />
      <HowOrderingWorks initialSteps={initialSettings?.processSteps} />
      <GoogleReviews />
      <CorporateBanner />
      <StatsSection />
      <AboutSection initialSettings={initialSettings} />
      <BlogPreview initialBlogs={initialBlogs} />
      <FaqSection initialFaqs={initialFaqs} />
    </>
  );
}
