"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  User,
  BookOpen,
  Search,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 6;

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.blogs) setBlogs(data.blogs);
      })
      .catch((err) => console.error("Error fetching blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))),
  ];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory =
      selectedCategory === "All" || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredBlogs[0];
  const gridPosts = filteredBlogs.slice(1);
  const paginatedGridPosts = gridPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="bg-canvas min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase text-primary block">
            Iceberg Print Journal & Technical Archive
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-ink tracking-tight">
            Engineering Tactile Impressions.
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Technical guides, GSM specifications, rigid packaging psychology, and commercial printmaking secrets from our Shomolu atelier.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, paper stocks, packaging..."
                className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-card border border-border rounded-button text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary shadow-soft"
              />
            </div>

            <div className="relative w-full sm:w-60 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter articles by category"
                className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none bg-card border border-border rounded-button text-xs font-bold text-ink shadow-soft cursor-pointer focus:outline-none focus:border-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Journal Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-ink-muted space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-xs font-semibold">Loading technical journal...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 text-center bg-card rounded-card border border-border max-w-md mx-auto p-8 space-y-3">
            <BookOpen className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-display font-bold text-base text-ink">
              No Articles Found
            </h3>
            <p className="text-xs text-ink-muted">
              No articles match your search or category filter.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {featuredPost && (
              <div className="bg-card rounded-card border border-border overflow-hidden shadow-elevation group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[300px] bg-canvas-soft overflow-hidden">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs text-primary font-bold uppercase tracking-wider">
                        <span>{featuredPost.category}</span>
                        <span>•</span>
                        <span className="text-ink-muted font-normal lowercase">
                          {featuredPost.readTime}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredPost.slug}`}>
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight group-hover:text-primary transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                      </Link>

                      <p className="text-xs sm:text-sm text-ink-body leading-relaxed line-clamp-4">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs text-ink-muted">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-ink">
                          {featuredPost.author}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gridPosts.length > 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedGridPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="bg-card rounded-card border border-border overflow-hidden shadow-soft antigravity-card flex flex-col justify-between group hover:border-primary/50 transition-colors"
                    >
                      <div>
                        <div className="relative h-56 w-full bg-canvas-soft overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-primary font-bold uppercase tracking-wider">
                              {post.category}
                            </span>
                            <span className="text-ink-muted">{post.readTime}</span>
                          </div>

                          <Link href={`/blog/${post.slug}`}>
                            <h3 className="font-display font-bold text-base text-ink line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-ink-body leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 border-t border-border/50 mt-4 flex items-center justify-between text-xs text-ink-muted">
                        <span className="font-semibold">{post.author}</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-primary font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalItems={gridPosts.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
