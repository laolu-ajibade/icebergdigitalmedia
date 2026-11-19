"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  Loader2,
  X,
  SlidersHorizontal,
  Tag as TagIcon,
} from "lucide-react";
import { R2_IMAGES } from "@/lib/constants";
import { R2MultiImageUpload } from "@/components/ui/R2ImageUpload";
import { Pagination } from "@/components/ui/Pagination";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { useToast } from "@/context/ToastContext";

interface TierItem {
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

const PAGE_SIZE = 6;

export default function AdminProductsPage() {
  const { showError, showSuccess, showPopup } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dbTags, setDbTags] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [basePrice, setBasePrice] = useState(5000);
  const [minQuantity, setMinQuantity] = useState(100);
  const [turnaroundDays, setTurnaroundDays] = useState("24-48 Hours");
  const [gallery, setGallery] = useState<string[]>([]);

  const [description, setDescription] = useState("");
  const [isTopSelling, setIsTopSelling] = useState(false);
  const [isPopular, setIsPopular] = useState(false);

  const [quantityTiers, setQuantityTiers] = useState<TierItem[]>([]);
  const [paperStocks, setPaperStocks] = useState<string[]>([]);
  const [newPaperStock, setNewPaperStock] = useState("");
  const [finishes, setFinishes] = useState<string[]>([]);
  const [newFinish, setNewFinish] = useState("");

  const fetchProducts = async () => {
    try {
      const [pRes, cRes, tRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/tags"),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      const tData = await tRes.json();
      if (pData.products) setProducts(pData.products);
      if (cData.categories) {
        setCategories(cData.categories);
        if (!categorySlug && cData.categories.length > 0) {
          setCategorySlug(cData.categories[0].slug);
        }
      }
      if (tData.tags) setDbTags(tData.tags);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle("");
    setSlug("");
    setCategorySlug(categories[0]?.slug || "");
    setBasePrice(5000);
    setMinQuantity(100);
    setTurnaroundDays("24-48 Hours");
    setGallery([]);
    setDescription("");
    setIsTopSelling(true);
    setIsPopular(true);
    setQuantityTiers([
      { quantity: 100, pricePerUnit: 50, totalPrice: 5000 },
      { quantity: 250, pricePerUnit: 44, totalPrice: 11000 },
      { quantity: 500, pricePerUnit: 38, totalPrice: 19000 },
    ]);
    setPaperStocks(["350gsm Matte Artboard", "600gsm Cotton Cardstock"]);
    setFinishes(["Matte Lamination", "Gloss Finish", "Spot UV Lamination"]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setTitle(prod.title || "");
    setSlug(prod.slug || "");
    setCategorySlug(prod.categorySlug || categories[0]?.slug || "");
    setBasePrice(prod.basePrice ?? 5000);
    setMinQuantity(prod.minQuantity ?? 100);
    setTurnaroundDays(prod.turnaroundDays || "24-48 Hours");

    const existingGallery =
      prod.gallery && prod.gallery.length > 0
        ? prod.gallery
        : prod.image
          ? [prod.image]
          : [];
    setGallery(existingGallery);

    setDescription(prod.description || "");
    setIsTopSelling(Boolean(prod.isTopSelling));
    setIsPopular(Boolean(prod.isPopular));

    setQuantityTiers(
      prod.quantityTiers && prod.quantityTiers.length > 0
        ? prod.quantityTiers.map((t: any) => ({
            quantity: Number(t.quantity) || 1,
            pricePerUnit: Number(t.pricePerUnit) || 0,
            totalPrice: Number(t.totalPrice) || 0,
          }))
        : [
            {
              quantity: prod.minQuantity || 100,
              pricePerUnit: Math.round(
                (prod.basePrice || 5000) / (prod.minQuantity || 100)
              ),
              totalPrice: prod.basePrice || 5000,
            },
          ]
    );
    setPaperStocks(
      prod.paperStocks && prod.paperStocks.length > 0
        ? [...prod.paperStocks]
        : ["350gsm Matte Artboard"]
    );
    setFinishes(
      prod.finishes && prod.finishes.length > 0
        ? [...prod.finishes]
        : ["Matte Lamination"]
    );
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cat = categories.find((c) => c.slug === categorySlug);
      const categoryName = cat?.name || "General Print";
      const cleanGallery =
        gallery.length > 0 ? gallery : [R2_IMAGES.businessCards];

      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        categorySlug,
        categoryName,
        basePrice: Number(basePrice),
        minQuantity: Number(minQuantity),
        turnaroundDays,
        image: cleanGallery[0],
        gallery: cleanGallery,
        description,
        isTopSelling,
        isPopular,
        quantityTiers,
        paperStocks,
        finishes,
      };

      const res = editingProduct
        ? await fetch(`/api/products/${editingProduct._id || editingProduct.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save product");
      }

      showSuccess(
        editingProduct
          ? `"${title}" updated in catalog.`
          : `"${title}" added to catalog.`,
        "Product Saved"
      );
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      const msg = err.message || "Failed to save product";
      showError(msg, "Product Error");
      showPopup({
        type: "error",
        title: "Failed to Save Product",
        message: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (prodSlug: string) => {
    if (!confirm("Are you sure you want to delete this commercial print product?"))
      return;
    try {
      const res = await fetch(`/api/products/${prodSlug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      showSuccess("Product removed from catalog.", "Deleted");
      fetchProducts();
    } catch (err: any) {
      showError(err.message || "Failed to delete product.", "Delete Failed");
    }
  };

  const categoryTagsMap = new Map<string, string[]>(
    categories.map((c) => [
      c.slug,
      Array.isArray(c.tags) && c.tags.length > 0 ? c.tags : ["Print"],
    ])
  );

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      !query ||
      prod.title?.toLowerCase().includes(query) ||
      prod.categoryName?.toLowerCase().includes(query) ||
      prod.description?.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "all" || prod.categorySlug === categoryFilter;

    const prodCatTags = categoryTagsMap.get(prod.categorySlug) || ["Print"];
    const matchesTag =
      tagFilter === "all" || prodCatTags.includes(tagFilter);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">
            Products
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Configure commercial print products, multi-image galleries, base prices (₦), and volume pricing tiers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search products, category, description..."
        filters={[
          {
            key: "category",
            value: categoryFilter,
            onChange: (val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            },
            options: categories.map((c) => ({
              value: c.slug,
              label: c.name,
            })),
            allLabel: "All Categories",
            icon: SlidersHorizontal,
            ariaLabel: "Filter products by category",
          },
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
            ariaLabel: "Filter products by tag",
          },
        ]}
      />

      {/* Table */}
      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden p-4 sm:p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-soft border-b border-border/60 text-ink-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Item & Gallery</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price (₦)</th>
                <th className="p-4">Min Qty</th>
                <th className="p-4">Volume Tiers</th>
                <th className="p-4">Top Selling</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-ink">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-ink-muted">
                    No products match your current search or filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                <tr key={prod.slug} className="hover:bg-canvas-soft/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-theme overflow-hidden bg-canvas-soft shrink-0 border border-border/40">
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-ink block">
                          {prod.title}
                        </span>
                      </div>
                    </div>
                  </td>
                    <td className="p-4">{prod.categoryName}</td>
                    <td className="p-4 font-bold text-ink">
                      ₦{prod.basePrice?.toLocaleString()}
                    </td>
                    <td className="p-4">{prod.minQuantity} pcs</td>
                    <td className="p-4 text-ink-muted">
                      {prod.quantityTiers?.length || 1} tiers
                    </td>
                    <td className="p-4">
                      {prod.isTopSelling ? (
                        <span className="font-bold text-primary">Featured</span>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-2 text-ink-muted hover:text-primary hover:bg-canvas-soft rounded-button transition-colors cursor-pointer"
                          title="Edit Product & Pricing"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.slug)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-button transition-colors cursor-pointer"
                          title="Delete Product"
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
          totalItems={filteredProducts.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-card rounded-card border border-border max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-elevation my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="font-display font-black text-lg text-ink">
                {editingProduct
                  ? `Edit Product & Pricing: ${editingProduct.title}`
                  : "Add Commercial Print Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Curved Edge Luxury Business Cards"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
                      className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none rounded-button bg-canvas-soft border border-border text-ink font-semibold cursor-pointer focus:outline-none focus:border-primary"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Starting Base Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Min Quantity (pcs) *
                  </label>
                  <input
                    type="number"
                    required
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Turnaround SLA
                  </label>
                  <input
                    type="text"
                    value={turnaroundDays}
                    onChange={(e) => setTurnaroundDays(e.target.value)}
                    placeholder="24-48 Hours"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>
              </div>

              <div className="p-4 rounded-theme bg-canvas-soft border border-border">
                <R2MultiImageUpload
                  label="Product Images"
                  folder="products"
                  values={gallery}
                  onChange={setGallery}
                  showPrimaryBadge={true}
                />
              </div>

              {/* Dynamic Quantity Tiers & Volume Pricing Editor */}
              <div className="p-4 rounded-theme bg-canvas-soft border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-ink">
                      Quantity Tiers & Dynamic Volume Pricing (₦)
                    </label>
                    <span className="text-[11px] text-ink-muted">
                      Define exact quantity thresholds, per-unit rates, and total run prices.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantityTiers((prev) => [
                        ...prev,
                        { quantity: 500, pricePerUnit: 40, totalPrice: 20000 },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-button bg-card border border-border hover:bg-canvas text-ink font-bold text-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tier</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {quantityTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-card p-2.5 rounded-theme border border-border/70"
                    >
                      <div className="col-span-4">
                        <label className="block text-[10px] text-ink-muted mb-0.5">
                          Quantity (pcs)
                        </label>
                        <input
                          type="number"
                          value={tier.quantity}
                          onChange={(e) => {
                            const qty = Number(e.target.value) || 1;
                            const next = [...quantityTiers];
                            next[idx] = {
                              ...next[idx],
                              quantity: qty,
                              totalPrice: qty * next[idx].pricePerUnit,
                            };
                            setQuantityTiers(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-canvas-soft border border-border text-ink font-semibold"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[10px] text-ink-muted mb-0.5">
                          Unit Price (₦)
                        </label>
                        <input
                          type="number"
                          value={tier.pricePerUnit}
                          onChange={(e) => {
                            const unit = Number(e.target.value) || 0;
                            const next = [...quantityTiers];
                            next[idx] = {
                              ...next[idx],
                              pricePerUnit: unit,
                              totalPrice: next[idx].quantity * unit,
                            };
                            setQuantityTiers(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-canvas-soft border border-border text-ink"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-[10px] text-ink-muted mb-0.5">
                          Total Price (₦)
                        </label>
                        <input
                          type="number"
                          value={tier.totalPrice}
                          onChange={(e) => {
                            const tot = Number(e.target.value) || 0;
                            const next = [...quantityTiers];
                            next[idx] = {
                              ...next[idx],
                              totalPrice: tot,
                            };
                            setQuantityTiers(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-canvas-soft border border-border text-ink font-bold"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end pt-4">
                        {quantityTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setQuantityTiers((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="p-1 text-ink-muted hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paper Stocks & Finishes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-theme bg-canvas-soft border border-border space-y-2">
                  <label className="block font-bold text-ink">
                    Paper Stocks / Materials
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {paperStocks.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-card border border-border text-[11px] font-medium text-ink"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setPaperStocks((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          className="text-ink-muted hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newPaperStock}
                      onChange={(e) => setNewPaperStock(e.target.value)}
                      placeholder="Add paper stock..."
                      className="flex-1 px-2.5 py-1.5 rounded bg-card border border-border text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPaperStock.trim()) return;
                        setPaperStocks((prev) => [...prev, newPaperStock.trim()]);
                        setNewPaperStock("");
                      }}
                      className="px-3 py-1.5 rounded bg-card border border-border font-semibold text-ink hover:bg-canvas"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-theme bg-canvas-soft border border-border space-y-2">
                  <label className="block font-bold text-ink">
                    Finishes / Laminations
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {finishes.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-card border border-border text-[11px] font-medium text-ink"
                      >
                        <span>{f}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFinishes((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          className="text-ink-muted hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newFinish}
                      onChange={(e) => setNewFinish(e.target.value)}
                      placeholder="Add finish option..."
                      className="flex-1 px-2.5 py-1.5 rounded bg-card border border-border text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFinish.trim()) return;
                        setFinishes((prev) => [...prev, newFinish.trim()]);
                        setNewFinish("");
                      }}
                      className="px-3 py-1.5 rounded bg-card border border-border font-semibold text-ink hover:bg-canvas"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify material weight (GSM), finish options, and print process..."
                  className="w-full px-3.5 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTopSelling}
                    onChange={(e) => setIsTopSelling(e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                  <span className="font-semibold text-ink">
                    Feature on Homepage Top Selling Section
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-button bg-canvas-muted text-ink font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Product & Pricing"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
