import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { SITE_URL } from "@/lib/constants";
import BlogListingClient from "@/components/blog/BlogListingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Technical Archive",
  description:
    "Technical guides on paper weights (GSM), foil finishes, rigid packaging, and commercial digital printing in Lagos from Iceberg Creative Print Studio.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog & Technical Archive | Iceberg Creative Print Studio",
    description:
      "Commercial printing specifications, GSM paper guides, and packaging insights from our Shomolu, Lagos studio.",
    url: `${SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  let initialBlogs: any[] = [];
  let itemListJsonLd: Record<string, any> | null = null;

  try {
    await connectDB();
    const blogs = await Blog.find({ published: { $ne: false } })
      .sort({ publishedAt: -1 })
      .lean();
    initialBlogs = JSON.parse(JSON.stringify(blogs || []));

    if (initialBlogs.length > 0) {
      itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Iceberg Blog",
        url: `${SITE_URL}/blog`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: initialBlogs.map((post, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: post.title,
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        },
      };
    }
  } catch {
    // Client component will fall back to API fetch if DB fails
  }

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <BlogListingClient initialBlogs={initialBlogs} />
    </>
  );
}
