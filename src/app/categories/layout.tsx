import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commercial Print Categories",
  description:
    "Browse all commercial printing and bespoke packaging categories from Iceberg Creative Print Studio in Shomolu, Lagos — rigid boxes, business cards, branded apparel, mugs, jotters, and wide-format banners.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "Commercial Print Categories | Iceberg Creative Print Studio",
    description:
      "Explore custom rigid boxes, luxury business cards, branded apparel, drinkware, jotters, and exhibition banners.",
    url: `${SITE_URL}/categories`,
  },
};

export default async function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let itemListJsonLd: Record<string, any> | null = null;

  try {
    await connectDB();
    const categories: any[] = await Category.find({}, { name: 1, slug: 1 })
      .sort({ order: 1 })
      .lean();

    if (categories.length > 0) {
      itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Commercial Print Categories",
        url: `${SITE_URL}/categories`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: categories.map((cat, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: cat.name,
            url: `${SITE_URL}/category/${cat.slug}`,
          })),
        },
      };
    }
  } catch {
    // Graceful fallback
  }

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
