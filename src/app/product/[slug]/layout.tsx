import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
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
    const product: any = await Product.findOne({ slug }).lean();
    if (!product) {
      return {
        title: "Custom Print Product",
        alternates: { canonical: `/product/${slug}` },
      };
    }

    const title = `${product.title} — Custom Print & Pricing`;
    const description =
      product.description ||
      `Configure ${product.title} starting from ₦${Number(product.basePrice || 0).toLocaleString()} for ${product.minQuantity || 1} pcs. Produced in Shomolu, Lagos with nationwide delivery.`;

    const ogImage = product.gallery?.[0] || product.image;

    return {
      title,
      description,
      alternates: { canonical: `/product/${slug}` },
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
    };
  } catch {
    return {
      title: "Custom Print Product",
      alternates: { canonical: `/product/${slug}` },
    };
  }
}

export default async function ProductSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let productJsonLd: Record<string, any> | null = null;
  let breadcrumbJsonLd: Record<string, any> | null = null;

  let product: any = null;
  let dbChecked = false;

  try {
    await connectDB();
    product = await Product.findOne({ slug }).lean();
    dbChecked = true;
    if (product) {
      const images =
        product.gallery && product.gallery.length > 0
          ? product.gallery
          : product.image
            ? [product.image]
            : [];

      const tierTotals = Array.isArray(product.quantityTiers)
        ? product.quantityTiers
            .map((t: any) => Number(t.totalPrice))
            .filter((n: number) => Number.isFinite(n) && n > 0)
        : [];
      const basePrice = Number(product.basePrice || 0);
      const hasMultipleTiers = tierTotals.length > 1;

      const specProperties =
        product.specifications && typeof product.specifications === "object"
          ? Object.entries(product.specifications).map(([name, value]) => ({
              "@type": "PropertyValue",
              name,
              value: String(value),
            }))
          : [];

      if (product.turnaroundDays) {
        specProperties.push({
          "@type": "PropertyValue",
          name: "Turnaround Time",
          value: String(product.turnaroundDays),
        });
      }

      productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        sku: product.slug,
        description: product.description,
        image: images,
        category: product.categoryName,
        brand: {
          "@type": "Brand",
          name: "Iceberg Creative Print Studio",
        },
        ...(specProperties.length > 0
          ? { additionalProperty: specProperties }
          : {}),
        offers: hasMultipleTiers
          ? {
              "@type": "AggregateOffer",
              url: `${SITE_URL}/product/${slug}`,
              priceCurrency: "NGN",
              lowPrice: Math.min(...tierTotals),
              highPrice: Math.max(...tierTotals),
              offerCount: tierTotals.length,
              availability: "https://schema.org/InStock",
            }
          : {
              "@type": "Offer",
              url: `${SITE_URL}/product/${slug}`,
              priceCurrency: "NGN",
              price: basePrice,
              availability: "https://schema.org/InStock",
            },
      };

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
            name: product.categoryName || "Categories",
            item: `${SITE_URL}/category/${product.categorySlug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: `${SITE_URL}/product/${slug}`,
          },
        ],
      };
    }
  } catch {
    // Graceful fallback if DB is unreachable
  }

  if (dbChecked && !product) {
    notFound();
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
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
