"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Layers, Edit, Trash2 } from "lucide-react";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { R2_IMAGES } from "@/lib/constants";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Package");
  const [image, setImage] = useState(R2_IMAGES.boxes);
  const [tagsInput, setTagsInput] = useState("Print, Design");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const parsedTags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    if (parsedTags.length > 5) {
      setErrorMsg("A category can have at most 5 tags (capped at 5).");
      return;
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: finalSlug,
        description,
        iconName,
        image,
        tags: parsedTags.length > 0 ? parsedTags : ["Print"],
        order: categories.length + 1,
        featured: true,
      }),
    });

    setName("");
    setSlug("");
    setDescription("");
    setTagsInput("Print, Design");
    setIsModalOpen(false);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">
            Print & Design Categories ({categories.length})
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Manage categories and tags (max 5 tags per category). Categories
            tagged with <strong>Print</strong> appear in the navbar dropdown.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-soft border-b border-border/60 text-ink-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug URL</th>
                <th className="p-4">Tags (Max 5)</th>
                <th className="p-4">Icon Token</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-ink">
              {categories.map((cat, i) => (
                <tr key={cat.slug} className="hover:bg-canvas-soft/50">
                  <td className="p-4 font-mono font-bold text-ink-muted">
                    {i + 1}
                  </td>
                  <td className="p-4 font-bold text-ink">{cat.name}</td>
                  <td className="p-4 font-mono text-ink-muted">
                    /category/{cat.slug}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {(cat.tags || ["Print"]).map((t: string) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-pale text-primary border border-primary/20"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-canvas-soft border border-border text-[11px] font-mono">
                      {cat.iconName}
                    </span>
                  </td>
                  <td className="p-4 text-ink-muted max-w-xs truncate">
                    {cat.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-card rounded-card border border-border max-w-md w-full p-6 space-y-4 shadow-elevation">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display font-bold text-base text-ink">
                Create New Category
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brand Identity Design"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. brand-identity-design"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Tags (Comma-separated, max 5) *
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. Print, Design, Branding"
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
                <span className="text-[10px] text-ink-muted block mt-1">
                  Tag with &apos;Print&apos; to appear in the header Print
                  Categories dropdown.
                </span>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Icon Token
                </label>
                <select
                  value={iconName}
                  onChange={e => setIconName(e.target.value)}
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                >
                  <option value="Package">Package / Box</option>
                  <option value="Shirt">Shirt / Apparel</option>
                  <option value="Coffee">Coffee / Mug</option>
                  <option value="Gift">Gift / Souvenir</option>
                  <option value="Flag">Flag / Banner</option>
                  <option value="Briefcase">Briefcase / Stationery</option>
                  <option value="FileText">FileText / Flyer</option>
                  <option value="Tag">Tag / Sticker</option>
                  <option value="CreditCard">CreditCard / ID Card</option>
                  <option value="ShoppingBag">ShoppingBag / Paper Bag</option>
                </select>
              </div>

              <R2ImageUpload
                label="Category Banner / Mockup "
                value={image}
                onChange={setImage}
                folder="categories"
              />

              <div>
                <label className="block font-bold text-ink mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief summary of items in this category..."
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
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
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
