import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const category: any = await Category.findOne({ slug }).lean();
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
  } catch {
    return {
      title: "Print Category",
      alternates: { canonical: `/category/${slug}` },
    };
  }
}

export default async function CategorySlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let breadcrumbJsonLd: Record<string, any> | null = null;
  let itemListJsonLd: Record<string, any> | null = null;
  let category: any = null;
  let dbChecked = false;

  try {
    await connectDB();
    const [catDoc, categoryProducts] = await Promise.all([
      Category.findOne({ slug }).lean(),
      Product.find({ categorySlug: slug }, { title: 1, slug: 1 }).lean(),
    ]);
    category = catDoc;
    dbChecked = true;
    if (category) {
      breadcrumbJsonLd = {
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
      };

      if (categoryProducts.length > 0) {
        itemListJsonLd = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${category.name} Products`,
          itemListElement: categoryProducts.map((p: any, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: p.title,
            url: `${SITE_URL}/product/${p.slug}`,
          })),
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  if (dbChecked && !category) {
    notFound();
  }

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
      {children}
    </>
  );
}
