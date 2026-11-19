"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  X,
  Tag as TagIcon,
} from "lucide-react";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { Pagination } from "@/components/ui/Pagination";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { useToast } from "@/context/ToastContext";

const PAGE_SIZE = 6;

export default function AdminCategoriesPage() {
  const { showError, showSuccess, showPopup } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [dbTags, setDbTags] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Package");
  const [image, setImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Print"]);

  const fetchData = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/tags"),
      ]);
      const catData = await catRes.json();
      const tagData = await tagRes.json();
      if (catData.categories) setCategories(catData.categories);
      if (tagData.tags) setDbTags(tagData.tags);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIconName("Package");
    setImage("");
    setSelectedTags(["Print"]);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name || "");
    setSlug(cat.slug || "");
    setDescription(cat.description || "");
    setIconName(cat.iconName || "Package");
    setImage(cat.image || "");
    setSelectedTags(
      Array.isArray(cat.tags) && cat.tags.length > 0 ? cat.tags : ["Print"]
    );
    setIsModalOpen(true);
  };

  const handleAddTagFromDropdown = (tagName: string) => {
    if (!tagName) return;
    if (!selectedTags.includes(tagName)) {
      setSelectedTags((prev) => [...prev, tagName]);
    }
  };

  const handleRemoveSelectedTag = (tagName: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagName));
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editingCategory?._id,
          name,
          slug: finalSlug,
          description,
          iconName,
          image,
          tags: selectedTags.length > 0 ? selectedTags : ["Print"],
          order: editingCategory ? editingCategory.order : categories.length + 1,
          featured: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save category");
      }

      showSuccess(`Category "${name}" saved.`, "Category Saved");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      const msg = err.message || "Failed to save category";
      showError(msg, "Category Error");
      showPopup({
        type: "error",
        title: "Failed to Save Category",
        message: msg,
      });
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    if (!confirm(`Are you sure you want to delete "${cat.name}"?`)) return;
    try {
      const res = await fetch(
        `/api/categories?slug=${encodeURIComponent(cat.slug)}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete category");
      showSuccess(`Category "${cat.name}" deleted.`, "Deleted");
      fetchData();
    } catch (err: any) {
      showError(err.message || "Failed to delete category.", "Delete Failed");
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      !query ||
      cat.name?.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query);

    const catTags: string[] =
      Array.isArray(cat.tags) && cat.tags.length > 0 ? cat.tags : ["Print"];
    const matchesTag = tagFilter === "all" || catTags.includes(tagFilter);

    return matchesSearch && matchesTag;
  });

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">
            Categories
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Manage product categories and assign tags from the database Tag model. Categories tagged with <strong>Print</strong> appear in the navbar dropdown.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Read-Only Database Tags Bar */}
      <div className="bg-card rounded-card border border-border/80 p-4 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <TagIcon className="w-4 h-4 text-primary" />
          <span className="font-bold text-ink">
            System Tags Model (Read-Only in UI · Managed in DB):
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dbTags.map((t) => (
            <span
              key={t.slug}
              className="px-3 py-1 rounded-theme bg-canvas-soft border border-border text-xs font-semibold text-ink"
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>

      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search categories by name or description..."
        filters={[
          {
            key: "tag",
            value: tagFilter,
            onChange: (val) => {
              setTagFilter(val);
              setCurrentPage(1);
            },
            options: dbTags.map((t) => ({
              value: t.name,
              label: t.name,
            })),
            allLabel: "All Tags",
            icon: TagIcon,
            ariaLabel: "Filter categories by tag",
          },
        ]}
      />

      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden p-4 sm:p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-soft border-b border-border/60 text-ink-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Category</th>
                <th className="p-4">Assigned Tags</th>
                <th className="p-4">Icon Token</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-ink">
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-muted">
                    No categories match your current search or tag filter.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat, i) => (
                <tr key={cat._id || cat.slug} className="hover:bg-canvas-soft/50">
                  <td className="p-4 font-mono font-bold text-ink-muted">
                    {(currentPage - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {cat.image && (
                        <div className="relative w-10 h-10 rounded-theme overflow-hidden bg-canvas-soft shrink-0 border border-border/40">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="font-bold text-ink">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(cat.tags || ["Print"]).map((t: string) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded text-[11px] font-bold bg-primary-pale text-primary border border-primary/20"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-canvas-soft border border-border text-[11px] font-mono">
                      {cat.iconName}
                    </span>
                  </td>
                  <td className="p-4 text-ink-muted max-w-xs truncate">
                    {cat.description}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-ink-muted hover:text-primary hover:bg-canvas-soft rounded-button transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-button transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredCategories.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-card rounded-card border border-border max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-elevation my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display font-bold text-base text-ink">
                {editingCategory
                  ? `Edit Category: ${editingCategory.name}`
                  : "Create New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brand Identity Design"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1.5">Slug URL</label>
                <input
                  type="text"
                  placeholder="e.g. brand-identity-design"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              {/* Tag Dropdown Selector */}
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Assign Tags (Select from Database Tags Dropdown) *
                </label>
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => handleAddTagFromDropdown(e.target.value)}
                    className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-canvas-soft border border-border text-ink font-semibold cursor-pointer focus:outline-none focus:border-primary"
                  >
                    <option value="">Select a tag to assign...</option>
                    {dbTags.map((t) => (
                      <option key={t.slug} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {selectedTags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-primary-pale text-primary font-bold text-xs border border-primary/20"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedTag(t)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Icon Token Dropdown */}
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Icon Token
                </label>
                <div className="relative">
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-canvas-soft border border-border text-ink font-semibold cursor-pointer focus:outline-none focus:border-primary"
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
                  <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <R2ImageUpload
                label="Category Image"
                value={image}
                onChange={setImage}
                folder="categories"
              />

              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of items in this category..."
                  className="w-full px-3.5 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
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
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
