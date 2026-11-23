"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";

export function BlogPreview({ initialBlogs }: { initialBlogs?: any[] }) {
  const [blogs, setBlogs] = useState<any[]>(initialBlogs || []);

  useEffect(() => {
    if (initialBlogs && initialBlogs.length > 0) return;
    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => {
        if (data.blogs) setBlogs(data.blogs);
      })
      .catch(() => {});
  }, [initialBlogs]);

  return (
    <section className="py-16 md:py-24 bg-canvas-soft border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
              Business Insights for Growing Brands
            </h2>
            <p className="text-sm md:text-base text-ink-muted mt-2 max-w-xl">
              Practical playbooks on building customer trust, choosing packaging
              that sells, and making your business stand out.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0"
          >
            <span>Explore Insights</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.slice(0, 2).map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-card rounded-card border border-card-border overflow-hidden shadow-soft antigravity-card flex flex-col group p-6 hover:border-primary/50 transition-colors"
            >
              <div className="relative h-56 w-full rounded-theme overflow-hidden bg-canvas-soft mb-5">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-ink-muted mb-2">
                <span className="font-semibold text-primary">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1 hidden sm:flex">
                  <User className="w-3.5 h-3.5" />
                  {post.author}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg md:text-xl text-ink group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-ink-body mt-2 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-5 pt-3 border-t border-card-border flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
