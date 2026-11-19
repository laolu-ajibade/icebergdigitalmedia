import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";

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

export default function CategorySlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
