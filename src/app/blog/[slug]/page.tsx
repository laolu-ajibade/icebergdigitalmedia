import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { SITE_URL, R2_IMAGES } from "@/lib/constants";
import BlogPostClient from "@/components/blog/BlogPostClient";

export const dynamic = "force-dynamic";

const getBlogBySlug = cache(async (slug: string) => {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug, published: { $ne: false } }).lean();
    return {
      dbChecked: true,
      blog: blog ? JSON.parse(JSON.stringify(blog)) : null,
    };
  } catch {
    return { dbChecked: false, blog: null };
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { blog } = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Article",
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
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { dbChecked, blog } = await getBlogBySlug(slug);

  if (dbChecked && !blog) {
    notFound();
  }

  const articleJsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt,
        image: blog.coverImage ? [blog.coverImage] : undefined,
        datePublished: blog.publishedAt
          ? new Date(blog.publishedAt).toISOString()
          : undefined,
        dateModified: blog.updatedAt
          ? new Date(blog.updatedAt).toISOString()
          : blog.publishedAt
            ? new Date(blog.publishedAt).toISOString()
            : undefined,
        author: {
          "@type": "Organization",
          name: blog.author || "Iceberg Creative Print Studio",
        },
        publisher: {
          "@type": "Organization",
          name: "Iceberg Creative Print Studio",
          logo: {
            "@type": "ImageObject",
            url: R2_IMAGES.logo,
          },
        },
        mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
      }
    : null;

  const breadcrumbJsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: blog.title,
            item: `${SITE_URL}/blog/${slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <BlogPostClient key={slug} slug={slug} initialBlog={blog} />
    </>
  );
}
