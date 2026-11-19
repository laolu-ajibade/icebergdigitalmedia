import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await ensureSeeded();
    const db = await connectDB();
    if (db) {
      const blogs = await Blog.find().sort({ publishedAt: -1 });
      return NextResponse.json({ blogs });
    }
    return NextResponse.json({ blogs: memoryStore.blogs });
  } catch (error: any) {
    return NextResponse.json({ blogs: memoryStore.blogs, error: error.message });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }

    const db = await connectDB();
    let created = data;
    if (db) {
      created = await Blog.create(data);
    }

    memoryStore.blogs.unshift(data);
    return NextResponse.json({ blog: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
