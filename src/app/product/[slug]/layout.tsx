import type { Metadata } from "next";
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

  try {
    await connectDB();
    const product: any = await Product.findOne({ slug }).lean();
    if (product) {
      const images =
        product.gallery && product.gallery.length > 0
          ? product.gallery
          : product.image
            ? [product.image]
            : [];

      productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: images,
        category: product.categoryName,
        brand: {
          "@type": "Brand",
          name: "Iceberg Creative Print Studio",
        },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/product/${slug}`,
          priceCurrency: "NGN",
          price: Number(product.basePrice || 0),
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
