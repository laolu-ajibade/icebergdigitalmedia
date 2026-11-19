import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let initialProduct: any | null = null;
  let initialRelatedProducts: any[] = [];
  let dbChecked = false;

  try {
    await connectDB();
    const [product, allProducts] = await Promise.all([
      Product.findOne({ slug }).lean(),
      Product.find().sort({ createdAt: -1 }).lean(),
    ]);
    dbChecked = true;
    if (product) {
      initialProduct = JSON.parse(JSON.stringify(product));
      const others = (allProducts || []).filter(
        (item: any) => item.slug !== (product as any).slug
      );
      const sameCat = others.filter(
        (item: any) => item.categorySlug === (product as any).categorySlug
      );
      const diffCat = others.filter(
        (item: any) => item.categorySlug !== (product as any).categorySlug
      );
      initialRelatedProducts = JSON.parse(
        JSON.stringify([...sameCat, ...diffCat].slice(0, 3))
      );
    }
  } catch {
    // Client component will fall back to API fetch if DB fails
  }

  if (dbChecked && !initialProduct) {
    notFound();
  }

  return (
    <ProductDetailClient
      key={slug}
      slug={slug}
      initialProduct={initialProduct}
      initialRelatedProducts={initialRelatedProducts}
    />
  );
}
