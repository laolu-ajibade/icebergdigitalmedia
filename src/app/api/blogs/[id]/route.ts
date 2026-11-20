import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { getAdminSession } from "@/lib/auth";
import { pickFields } from "@/lib/pick";

export const dynamic = "force-dynamic";

const BLOG_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "coverImage",
  "author",
  "readTime",
  "category",
  "tags",
  "published",
  "publishedAt",
] as const;

const byIdOrSlug = (id: string) =>
  mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    await connectDB();

    const baseFilter = byIdOrSlug(id);
    const filter = session ? baseFilter : { $and: [baseFilter, { published: { $ne: false } }] };
    const blog = await Blog.findOne(filter);
    if (!blog) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ blog });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const raw = await request.json();
    const data = pickFields(raw, BLOG_FIELDS);
    await connectDB();

    const updated = await Blog.findOneAndUpdate(byIdOrSlug(id), data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ blog: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    await Blog.findOneAndDelete(byIdOrSlug(id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
