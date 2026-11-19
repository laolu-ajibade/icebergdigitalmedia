import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import BlogPostClient from "@/components/blog/BlogPostClient";

export const dynamic = "force-dynamic";

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let initialBlog: any | null = null;
  let dbChecked = false;

  try {
    await connectDB();
    const blog = await Blog.findOne({ slug }).lean();
    dbChecked = true;
    if (blog) {
      initialBlog = JSON.parse(JSON.stringify(blog));
    }
  } catch {
    // Client component will fall back to API fetch if DB fails
  }

  if (dbChecked && !initialBlog) {
    notFound();
  }

  return <BlogPostClient key={slug} slug={slug} initialBlog={initialBlog} />;
}
