import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Blog } from "@/models/Blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/brand-studio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    await connectDB();
    const [categories, products, blogs] = await Promise.all([
      Category.find({}, { slug: 1, updatedAt: 1 }).lean(),
      Product.find({}, { slug: 1, updatedAt: 1 }).lean(),
      Blog.find({ published: { $ne: false } }, { slug: 1, updatedAt: 1, publishedAt: 1 }).lean(),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: any) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((p: any) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((b: any) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt
        ? new Date(b.updatedAt)
        : b.publishedAt
          ? new Date(b.publishedAt)
          : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...productRoutes,
      ...blogRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
