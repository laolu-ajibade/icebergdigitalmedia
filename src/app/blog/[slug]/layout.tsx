import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const blog: any = await Blog.findOne({ slug }).lean();
    if (!blog) {
      return {
        title: "Print Journal Article",
        alternates: { canonical: `/blog/${slug}` },
      };
    }

    const title = blog.title;
    const description =
      blog.excerpt ||
      `${blog.title} — commercial print and packaging insights from Iceberg Creative Print Studio, Lagos.`;

    return {
      title,
      description,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        type: "article",
        title,
        description,
        images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
      },
    };
  } catch {
    return {
      title: "Print Journal Article",
      alternates: { canonical: `/blog/${slug}` },
    };
  }
}

export default function BlogSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
