import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { SITE_URL } from "@/lib/constants";
import CategoryDetailClient from "@/components/category/CategoryDetailClient";

export const dynamic = "force-dynamic";

const getCategoryData = cache(async (slug: string) => {
  try {
    await connectDB();
    const [category, products] = await Promise.all([
      Category.findOne({ slug }).lean(),
      Product.find({ categorySlug: slug }).sort({ createdAt: -1 }).lean(),
    ]);
    return {
      dbChecked: true,
      category: category ? JSON.parse(JSON.stringify(category)) : null,
      products: category ? JSON.parse(JSON.stringify(products || [])) : [],
    };
  } catch {
    return { dbChecked: false, category: null, products: [] };
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryData(slug);

  if (!category) {
    return {
      title: "Print Category",
      alternates: { canonical: `/category/${slug}` },
    };
  }

  const title = `${category.name} Printing in Lagos`;
  const description =
    category.description ||
    `Order custom ${category.name.toLowerCase()} with calibrated CMYK printing, volume pricing, and fast Lagos & nationwide delivery from Iceberg Creative Print Studio.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title,
      description,
      images: category.image ? [{ url: category.image }] : undefined,
    },
  };
}

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { dbChecked, category, products } = await getCategoryData(slug);

  if (dbChecked && !category) {
    notFound();
  }

  const breadcrumbJsonLd = category
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Categories",
            item: `${SITE_URL}/categories`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: `${SITE_URL}/category/${slug}`,
          },
        ],
      }
    : null;

  const itemListJsonLd =
    category && products.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${category.name} Products`,
          itemListElement: products.map((p: any, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: p.title,
            url: `${SITE_URL}/product/${p.slug}`,
          })),
        }
      : null;

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <CategoryDetailClient
        key={slug}
        slug={slug}
        initialCategory={category}
        initialProducts={products}
      />
    </>
  );
}
