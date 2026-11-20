import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { pickFields } from "@/lib/pick";

export const dynamic = "force-dynamic";

const PRODUCT_FIELDS = [
  "title",
  "slug",
  "categorySlug",
  "categoryName",
  "description",
  "basePrice",
  "minQuantity",
  "deliveryDays",
  "image",
  "gallery",
  "paperStocks",
  "finishes",
  "quantityTiers",
  "isPopular",
  "isTopSelling",
  "specifications",
] as const;

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const topSelling = searchParams.get("topSelling");
    const popular = searchParams.get("popular");

    const query: Record<string, any> = {};
    if (category) query.categorySlug = category;
    if (topSelling === "true") query.isTopSelling = true;
    if (popular === "true") query.isPopular = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ products: [], error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await request.json();
    const data = pickFields(raw, PRODUCT_FIELDS);
    if (!data.title || !data.slug || !data.categorySlug) {
      return NextResponse.json(
        { error: "Title, slug, and category are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const createdProduct = await Product.create(data);
    return NextResponse.json({ product: createdProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
