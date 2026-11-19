import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ order: 1 });
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ categories: [], error: error.message }, { status: 500 });
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
      tags = data.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }
    data.tags = tags.slice(0, 5);

    await connectDB();
    const createdCategory = await Category.findOneAndUpdate(
      { slug: data.slug },
      data,
      { new: true, upsert: true }
    );

    return NextResponse.json({ category: createdCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
