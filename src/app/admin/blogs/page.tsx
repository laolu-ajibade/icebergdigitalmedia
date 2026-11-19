"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit2,
  FileText,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { R2_IMAGES } from "@/lib/constants";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Print Engineering");
  const [coverImage, setCoverImage] = useState(R2_IMAGES.businessCards);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [readTime, setReadTime] = useState("5 min read");

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.blogs) setBlogs(data.blogs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setCategory("Print Engineering");
    setCoverImage(R2_IMAGES.businessCards);
    setExcerpt("");
    setContent("");
    setReadTime("5 min read");
    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const payload = {
      title,
      slug: finalSlug,
      category,
      coverImage,
      excerpt,
      content,
      readTime,
      author: "Iceberg Master Printmakers",
      published: true,
      publishedAt: new Date(),
    };

    if (editingBlog) {
      await fetch(`/api/blogs/${editingBlog.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setIsModalOpen(false);
    fetchBlogs();
  };

  const handleDeleteBlog = async (blogSlug: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    await fetch(`/api/blogs/${blogSlug}`, { method: "DELETE" });
    fetchBlogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">
            Print Journal & Articles CMS
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Author and publish educational printing guides, paper stock
            analyses, and brand case studies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-soft border-b border-border/60 text-ink-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Article</th>
                <th className="p-4">Category</th>
                <th className="p-4">Read Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-ink">
              {blogs.map(b => (
                <tr key={b.slug} className="hover:bg-canvas-soft/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-theme overflow-hidden bg-canvas-soft shrink-0 border border-border/40">
                        <Image
                          src={b.coverImage}
                          alt={b.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-md">
                        <span className="font-bold text-ink block truncate">
                          {b.title}
                        </span>
                        <span className="text-[10px] text-ink-muted font-mono">
                          /blog/{b.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{b.category}</td>
                  <td className="p-4">{b.readTime}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <a
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block p-1.5 text-ink-muted hover:text-primary transition-colors"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteBlog(b.slug)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-card rounded-card border border-border max-w-xl w-full p-6 space-y-4 shadow-elevation">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display font-bold text-base text-ink">
                Author Print Journal Article
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Guide to Specialty Foil Stamping in Lagos"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>
              </div>

              <R2ImageUpload
                label="Cover Image "
                value={coverImage}
                onChange={setCoverImage}
                folder="blogs"
              />

              <div>
                <label className="block font-bold text-ink mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Brief preview displayed on the blog card..."
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Full Article Content (Markdown format supported) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write article paragraphs and headers (use ### for subheadings)..."
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-button bg-canvas-muted text-ink font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-button bg-primary text-primary-foreground font-bold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
