import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import CategoryDetailClient from "@/components/category/CategoryDetailClient";

export const dynamic = "force-dynamic";

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let initialCategory: any | null = null;
  let initialProducts: any[] = [];
  let dbChecked = false;

  try {
    await connectDB();
    const [category, products] = await Promise.all([
      Category.findOne({ slug }).lean(),
      Product.find({ categorySlug: slug }).sort({ createdAt: -1 }).lean(),
    ]);
    dbChecked = true;
    if (category) {
      initialCategory = JSON.parse(JSON.stringify(category));
      initialProducts = JSON.parse(JSON.stringify(products || []));
    }
  } catch {
    // Client component will fall back to API fetch if DB fails
  }

  if (dbChecked && !initialCategory) {
    notFound();
  }

  return (
    <CategoryDetailClient
      key={slug}
      slug={slug}
      initialCategory={initialCategory}
      initialProducts={initialProducts}
    />
  );
}
