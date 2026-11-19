"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, User, MessageSquare } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";

export default function BlogPostReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.blog) setBlog(data.blog);
      })
      .catch(() => {});
  }, [slug]);

  if (!blog) {
    return (
      <div className="py-24 text-center text-ink-muted">
        <p className="text-sm">Loading article...</p>
      </div>
    );
  }

  return (
    <article className="py-12 md:py-20 bg-canvas-soft min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Print Journal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {blog.category}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted pt-2 border-t border-border/40">
            <span className="flex items-center gap-1 text-ink font-medium">
              <User className="w-3.5 h-3.5 text-primary" />
              {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {blog.readTime}
            </span>
            <span>•</span>
            <span>
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-80 sm:h-96 w-full rounded-card overflow-hidden shadow-elevation mb-10 border border-border/60">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="bg-card rounded-card border border-border/80 p-8 md:p-12 shadow-soft space-y-6 text-ink-body leading-relaxed text-sm sm:text-base">
          {blog.content.split("\n\n").map((block: string, idx: number) => {
            if (block.startsWith("### ")) {
              return (
                <h2
                  key={idx}
                  className="font-display font-bold text-xl sm:text-2xl text-ink pt-4 tracking-tight"
                >
                  {block.replace("### ", "")}
                </h2>
              );
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n- ");
              return (
                <ul key={idx} className="space-y-2 list-disc pl-5 text-sm">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            if (block.startsWith("1. ")) {
              const items = block.split(/\n\d+\.\s/);
              return (
                <ol key={idx} className="space-y-2.5 list-decimal pl-5 text-sm">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^\d+\.\s/, "")}</li>
                  ))}
                </ol>
              );
            }
            return <p key={idx}>{block}</p>;
          })}

          {/* Callout Card */}
          <div className="mt-10 p-6 md:p-8 rounded-theme bg-primary-pale/40 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-base text-ink">
                Bring Your Ideas to Life with Iceberg Studio
              </h3>
              <p className="text-xs text-ink-muted mt-1 max-w-md">
                Consult with our master printmakers in Shomolu, Lagos on paper
                stocks, foil stamping, and bespoke packaging dielines.
              </p>
            </div>
            <a
              href={getWhatsAppLink(
                "Hello Iceberg Studio, I read your print article and would like to discuss a project.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-button bg-[#25D366] text-white font-bold text-xs shrink-0 shadow-soft"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss Project on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
