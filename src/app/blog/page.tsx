import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import BlogListingClient from "@/components/blog/BlogListingClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let initialBlogs: any[] = [];

  try {
    await connectDB();
    const blogs = await Blog.find({ published: { $ne: false } })
      .sort({ publishedAt: -1 })
      .lean();
    initialBlogs = JSON.parse(JSON.stringify(blogs || []));
  } catch {
    // Client component will fall back to API fetch if DB fails
  }

  return <BlogListingClient initialBlogs={initialBlogs} />;
}
