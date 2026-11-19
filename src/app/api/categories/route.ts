import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { Category } from "@/models/Category";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await ensureSeeded();
    const db = await connectDB();
    if (db) {
      const categories = await Category.find().sort({ order: 1 });
      return NextResponse.json({ categories });
    }
    return NextResponse.json({ categories: memoryStore.categories });
  } catch (error: any) {
    return NextResponse.json({ categories: memoryStore.categories, error: error.message });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    let tags = Array.isArray(data.tags) ? data.tags : ["Print"];
    if (typeof data.tags === "string") {
      tags = data.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    if (tags.length > 5) {
      tags = tags.slice(0, 5);
    }
    data.tags = tags;

    const db = await connectDB();
    let createdCategory = data;
    if (db) {
      createdCategory = await Category.create(data);
    }

    // Always keep memoryStore in sync
    const existingIdx = memoryStore.categories.findIndex((c) => c.slug === data.slug);
    if (existingIdx >= 0) {
      memoryStore.categories[existingIdx] = { ...memoryStore.categories[existingIdx], ...data };
    } else {
      memoryStore.categories.push(data);
    }

    return NextResponse.json({ category: createdCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
