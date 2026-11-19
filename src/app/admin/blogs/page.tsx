"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronDown,
  X,
} from "lucide-react";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/context/ToastContext";

const PAGE_SIZE = 6;

export default function AdminBlogsPage() {
  const { showError, showSuccess, showPopup } = useToast();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Print Engineering");
  const [coverImage, setCoverImage] = useState("");
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
    setCoverImage("");
    setExcerpt("");
    setContent("");
    setReadTime("5 min read");
    setIsModalOpen(true);
  };

  const openEditModal = (b: any) => {
    setEditingBlog(b);
    setTitle(b.title || "");
    setSlug(b.slug || "");
    setCategory(b.category || "Print Engineering");
    setCoverImage(b.coverImage || "");
    setExcerpt(b.excerpt || "");
    setContent(b.content || "");
    setReadTime(b.readTime || "5 min read");
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
      author: editingBlog?.author || "Iceberg Master Printmakers",
      published: true,
      publishedAt: editingBlog?.publishedAt || new Date(),
    };

    try {
      const res = editingBlog
        ? await fetch(`/api/blogs/${editingBlog._id || editingBlog.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save article");
      }

      showSuccess(`Article "${title}" published.`, "Article Saved");
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      const msg = err.message || "Failed to save article";
      showError(msg, "Article Error");
      showPopup({
        type: "error",
        title: "Failed to Save Article",
        message: msg,
      });
    }
  };

  const handleDeleteBlog = async (blogSlug: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/blogs/${blogSlug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete article");
      showSuccess("Article deleted from Print Journal.", "Deleted");
      fetchBlogs();
    } catch (err: any) {
      showError(err.message || "Failed to delete article.", "Delete Failed");
    }
  };

  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">
            Print Journal & Articles CMS ({blogs.length})
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Author and publish educational printing guides, paper stock analyses, and brand case studies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Post</span>
        </button>
      </div>

      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden p-4 sm:p-6 space-y-4">
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
              {paginatedBlogs.map((b) => (
                <tr key={b._id || b.slug} className="hover:bg-canvas-soft/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {b.coverImage && (
                        <div className="relative w-12 h-10 rounded-theme overflow-hidden bg-canvas-soft shrink-0 border border-border/40">
                          <Image
                            src={b.coverImage}
                            alt={b.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-ink block line-clamp-1 max-w-md">
                          {b.title}
                        </span>
                        <span className="text-[10px] text-ink-muted">
                          /blog/{b.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{b.category}</td>
                  <td className="p-4 text-ink-muted">{b.readTime}</td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-600">Published</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <a
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-ink-muted hover:text-primary hover:bg-canvas-soft rounded-button transition-colors"
                        title="View Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-2 text-ink-muted hover:text-primary hover:bg-canvas-soft rounded-button transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.slug)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-button transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={blogs.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-card rounded-card border border-border max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-elevation my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display font-bold text-base text-ink">
                {editingBlog
                  ? `Edit Article: ${editingBlog.title}`
                  : "Author Print Journal Article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Guide to Specialty Foil Stamping in Lagos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-canvas-soft border border-border text-ink font-semibold cursor-pointer focus:outline-none focus:border-primary"
                    >
                      <option value="Print Engineering">Print Engineering</option>
                      <option value="Bespoke Packaging">Bespoke Packaging</option>
                      <option value="Print">Print</option>
                      <option value="Design">Design</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Apparel">Apparel</option>
                      <option value="Branding">Branding</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>
              </div>

              <R2ImageUpload
                label="Cover Image"
                value={coverImage}
                onChange={setCoverImage}
                folder="blogs"
              />

              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Summary / Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief preview displayed on the blog card..."
                  className="w-full px-3.5 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Full Article Content (Markdown format supported) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write technical print guide here. Use ### for subheadings..."
                  className="w-full px-3.5 py-2.5 rounded-button bg-canvas-soft border border-border text-ink font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-button bg-canvas-muted text-ink font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold cursor-pointer"
                >
                  {editingBlog ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
