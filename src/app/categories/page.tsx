import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Tag } from "@/models/Tag";
import { SITE_URL } from "@/lib/constants";
import CategoriesClient from "@/components/categories/CategoriesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commercial Categories",
  description:
    "Browse all commercial printing and bespoke packaging categories from Iceberg Creative Print Studio in Shomolu, Lagos — rigid boxes, business cards, branded apparel, mugs, jotters, and wide-format banners.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "Commercial Categories | Iceberg Creative Print Studio",
    description:
      "Explore custom rigid boxes, luxury business cards, branded apparel, drinkware, jotters, and exhibition banners.",
    url: `${SITE_URL}/categories`,
  },
};

export default async function CategoriesPage() {
  let initialCategories: any[] = [];
  let initialTags: any[] = [];
  let itemListJsonLd: Record<string, any> | null = null;

  try {
    await connectDB();
    const [categories, tags] = await Promise.all([
      Category.find().sort({ order: 1 }).lean(),
      Tag.find().sort({ order: 1 }).lean(),
    ]);
    initialCategories = JSON.parse(JSON.stringify(categories || []));
    initialTags = JSON.parse(JSON.stringify(tags || []));

    if (initialCategories.length > 0) {
      itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Commercial Categories",
        url: `${SITE_URL}/categories`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: initialCategories.map((cat, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: cat.name,
            url: `${SITE_URL}/category/${cat.slug}`,
          })),
        },
      };
    }
  } catch {
    // Client component will fall back to API fetch if DB fails
  }

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <CategoriesClient
        initialCategories={initialCategories}
        initialTags={initialTags}
      />
    </>
  );
}
