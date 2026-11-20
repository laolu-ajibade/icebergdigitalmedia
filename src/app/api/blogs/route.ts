import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const session = await getAdminSession();
    await connectDB();
    const filter = session ? {} : { published: { $ne: false } };
    const blogs = await Blog.find(filter).sort({ publishedAt: -1 });
    return NextResponse.json({ blogs });
  } catch (error: any) {
    return NextResponse.json({ blogs: [], error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await request.json();
    const data = pickFields(raw, BLOG_FIELDS);
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await Blog.create(data);
    return NextResponse.json({ blog: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
