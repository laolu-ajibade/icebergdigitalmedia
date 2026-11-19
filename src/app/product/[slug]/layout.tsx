import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

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

export default function ProductSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
