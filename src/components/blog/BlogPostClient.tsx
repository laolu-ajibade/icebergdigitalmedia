"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, User, MessageSquare } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link
            key={idx}
            href={href}
            className="text-primary font-semibold underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            {label}
          </Link>
        );
      }
      return (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          {label}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderMarkdownBlock(block: string, idx: number): React.ReactNode {
  const trimmed = block.trim();
  if (!trimmed) return null;

  if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
    return <hr key={idx} className="border-border/60 my-6" />;
  }

  // Handle heading followed by a body line without a blank line (e.g. "### Question?\nAnswer")
  const headingMatch = trimmed.match(/^(#{1,4})\s+(.+?)(?:\n([\s\S]+))?$/);
  if (headingMatch) {
    const [, hashes, headingText, rest] = headingMatch;
    const headingNode =
      hashes.length <= 3 ? (
        <h2 className="font-display font-bold text-xl sm:text-2xl text-ink pt-4 tracking-tight">
          {renderInlineMarkdown(headingText)}
        </h2>
      ) : (
        <h3 className="font-display font-bold text-lg sm:text-xl text-ink pt-3 tracking-tight">
          {renderInlineMarkdown(headingText)}
        </h3>
      );

    if (rest && rest.trim()) {
      return (
        <React.Fragment key={idx}>
          {headingNode}
          {renderMarkdownBlock(rest, idx * 1000 + 1)}
        </React.Fragment>
      );
    }
    return <React.Fragment key={idx}>{headingNode}</React.Fragment>;
  }

  if (/^[-*]\s+/.test(trimmed)) {
    const items = trimmed.split(/\n[-*]\s+/);
    return (
      <ul key={idx} className="space-y-2 list-disc pl-5 text-sm sm:text-base">
        {items.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item.replace(/^[-*]\s+/, ""))}</li>
        ))}
      </ul>
    );
  }

  if (/^\d+\.\s+/.test(trimmed)) {
    const items = trimmed.split(/\n\d+\.\s+/);
    return (
      <ol key={idx} className="space-y-2.5 list-decimal pl-5 text-sm sm:text-base">
        {items.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item.replace(/^\d+\.\s+/, ""))}</li>
        ))}
      </ol>
    );
  }

  return <p key={idx}>{renderInlineMarkdown(trimmed)}</p>;
}

export default function BlogPostClient({
  slug,
  initialBlog,
}: {
  slug: string;
  initialBlog?: any | null;
}) {
  const [blog, setBlog] = useState<any | null>(initialBlog || null);

  useEffect(() => {
    if (initialBlog) return;
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.blog) setBlog(data.blog);
      })
      .catch(() => {});
  }, [slug, initialBlog]);

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
          <span>Back to Blog</span>
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
          {blog.content
            .replace(/\r\n/g, "\n")
            .split(/\n{2,}/)
            .map((block: string, idx: number) => renderMarkdownBlock(block, idx))}

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
