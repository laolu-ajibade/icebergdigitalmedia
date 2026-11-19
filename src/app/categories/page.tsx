import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Tag } from "@/models/Tag";
import CategoriesClient from "@/components/categories/CategoriesClient";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let initialCategories: any[] = [];
  let initialTags: any[] = [];

  try {
    await connectDB();
    const [categories, tags] = await Promise.all([
      Category.find().sort({ order: 1 }).lean(),
      Tag.find().sort({ order: 1 }).lean(),
    ]);
    initialCategories = JSON.parse(JSON.stringify(categories || []));
    initialTags = JSON.parse(JSON.stringify(tags || []));
  } catch {
    // Client component will fall back to API fetch if DB fails
  }

  return (
    <CategoriesClient
      initialCategories={initialCategories}
      initialTags={initialTags}
    />
  );
}
