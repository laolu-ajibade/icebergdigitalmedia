import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { getAdminSession } from "@/lib/auth";
import { pickFields } from "@/lib/pick";

export const dynamic = "force-dynamic";

const CATEGORY_FIELDS = [
  "name",
  "slug",
  "description",
  "iconName",
  "image",
  "order",
  "featured",
  "tags",
] as const;

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

    const raw = await request.json();
    const updateFields = pickFields(raw, CATEGORY_FIELDS);
    if (!updateFields.name || !updateFields.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    let tags = Array.isArray(updateFields.tags) ? updateFields.tags : ["Print"];
    if (typeof raw.tags === "string") {
      tags = raw.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }
    updateFields.tags = tags;

    await connectDB();
    const filter = raw._id ? { _id: raw._id } : { slug: updateFields.slug };
    const savedCategory = await Category.findOneAndUpdate(
      filter,
      updateFields,
      { new: true, upsert: true }
    );

    return NextResponse.json({ category: savedCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    await connectDB();
    if (id) {
      await Category.findByIdAndDelete(id);
    } else if (slug) {
      await Category.findOneAndDelete({ slug });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
