import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { Product } from "@/models/Product";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await ensureSeeded();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const topSelling = searchParams.get("topSelling");
    const popular = searchParams.get("popular");

    const db = await connectDB();
    if (db) {
      const query: any = {};
      if (category) query.categorySlug = category;
      if (topSelling === "true") query.isTopSelling = true;
      if (popular === "true") query.isPopular = true;

      const products = await Product.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ products });
    }

    let products = [...memoryStore.products];
    if (category) {
      products = products.filter((p) => p.categorySlug === category);
    }
    if (topSelling === "true") {
      products = products.filter((p) => p.isTopSelling);
    }
    if (popular === "true") {
      products = products.filter((p) => p.isPopular);
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ products: memoryStore.products, error: error.message });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.title || !data.slug || !data.basePrice) {
      return NextResponse.json({ error: "Title, slug, and base price are required" }, { status: 400 });
    }

    const db = await connectDB();
    let created = data;
    if (db) {
      created = await Product.create(data);
    }

    memoryStore.products.unshift(data);
    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
