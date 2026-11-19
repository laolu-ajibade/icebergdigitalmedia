import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectDB();
    if (db) {
      const blog = await Blog.findOne({ $or: [{ _id: id }, { slug: id }] });
      if (blog) return NextResponse.json({ blog });
    }

    const item = memoryStore.blogs.find((b) => b.slug === id || b._id === id);
    if (!item) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ blog: item });
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
    const data = await request.json();

    const db = await connectDB();
    if (db) {
      const updated = await Blog.findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }] },
        data,
        { new: true }
      );
      if (updated) return NextResponse.json({ blog: updated });
    }

    const index = memoryStore.blogs.findIndex((b) => b.slug === id || b._id === id);
    if (index >= 0) {
      memoryStore.blogs[index] = { ...memoryStore.blogs[index], ...data };
      return NextResponse.json({ blog: memoryStore.blogs[index] });
    }

    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await connectDB();
    if (db) {
      await Blog.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    }

    memoryStore.blogs = memoryStore.blogs.filter((b) => b.slug !== id && b._id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
