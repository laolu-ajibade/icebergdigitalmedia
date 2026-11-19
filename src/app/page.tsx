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

export default function HomePage() {
  return (
    <>
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
