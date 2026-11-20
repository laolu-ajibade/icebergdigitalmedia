import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Tag } from "@/models/Tag";
import { AllProductsCatalog } from "@/components/products/AllProductsCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Commercial Print Products",
  description:
    "Browse the complete catalog of commercial print products, rigid packaging, branded apparel, business cards, drinkware, and signage at Iceberg Studio.",
};

export default async function AllProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];

  try {
    await connectDB();
    const [p, c, t] = await Promise.all([
      Product.find().sort({ isTopSelling: -1, createdAt: -1 }).lean(),
      Category.find().sort({ order: 1 }).lean(),
      Tag.find().sort({ order: 1 }).lean(),
    ]);
    products = JSON.parse(JSON.stringify(p || []));
    categories = JSON.parse(JSON.stringify(c || []));
    tags = JSON.parse(JSON.stringify(t || []));
  } catch {
    // Graceful fallback
  }

  return (
    <AllProductsCatalog
      products={products}
      categories={categories}
      tags={tags}
    />
  );
}
