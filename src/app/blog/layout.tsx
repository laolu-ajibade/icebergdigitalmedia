import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Print Journal & Technical Archive",
  description:
    "Technical guides on paper weights (GSM), foil finishes, rigid packaging, and commercial digital printing in Lagos from Iceberg Creative Print Studio.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Print Journal & Technical Archive | Iceberg Creative Print Studio",
    description:
      "Commercial printing specifications, GSM paper guides, and packaging insights from our Shomolu, Lagos studio.",
    url: `${SITE_URL}/blog`,
  },
};

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let itemListJsonLd: Record<string, any> | null = null;

  try {
    await connectDB();
    const blogs: any[] = await Blog.find(
      { published: { $ne: false } },
      { title: 1, slug: 1 }
    )
      .sort({ publishedAt: -1 })
      .lean();

    if (blogs.length > 0) {
      itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Iceberg Print Journal",
        url: `${SITE_URL}/blog`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: blogs.map((post, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: post.title,
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        },
      };
    }
  } catch {
    // Graceful fallback
  }

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
