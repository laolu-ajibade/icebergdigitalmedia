import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
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

  try {
    await connectDB();
    const category: any = await Category.findOne({ slug }).lean();
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
    }
  } catch {
    // Graceful fallback
  }

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
