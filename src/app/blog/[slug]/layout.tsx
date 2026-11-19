import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { SITE_URL, R2_IMAGES } from "@/lib/constants";

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

export default async function BlogSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let articleJsonLd: Record<string, any> | null = null;
  let breadcrumbJsonLd: Record<string, any> | null = null;

  let blog: any = null;
  let dbChecked = false;

  try {
    await connectDB();
    blog = await Blog.findOne({ slug }).lean();
    dbChecked = true;
    if (blog) {
      articleJsonLd = {
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
      };

      breadcrumbJsonLd = {
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
            name: "Print Journal",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: blog.title,
            item: `${SITE_URL}/blog/${slug}`,
          },
        ],
      };
    }
  } catch {
    // Graceful fallback
  }

  if (dbChecked && !blog) {
    notFound();
  }

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
      {children}
    </>
  );
}
