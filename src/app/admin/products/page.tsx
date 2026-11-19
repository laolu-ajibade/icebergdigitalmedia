"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Package, Check, X } from "lucide-react";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { R2_IMAGES } from "@/lib/constants";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [basePrice, setBasePrice] = useState(5000);
  const [minQuantity, setMinQuantity] = useState(100);
  const [deliveryDays, setDeliveryDays] = useState("24-48 Hours");
  const [image, setImage] = useState(R2_IMAGES.businessCards);
  const [description, setDescription] = useState("");
  const [isTopSelling, setIsTopSelling] = useState(false);
  const [isPopular, setIsPopular] = useState(false);

  const fetchProducts = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      if (pData.products) setProducts(pData.products);
      if (cData.categories) {
        setCategories(cData.categories);
        if (!categorySlug && cData.categories.length > 0) {
          setCategorySlug(cData.categories[0].slug);
        }
      }
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
    setBasePrice(5000);
    setMinQuantity(100);
    setDeliveryDays("24-48 Hours");
    setImage(R2_IMAGES.businessCards);
    setDescription("");
    setIsTopSelling(false);
    setIsPopular(false);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.slug === categorySlug);
    const categoryName = cat?.name || "General Print";

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      categorySlug,
      categoryName,
      basePrice: Number(basePrice),
      minQuantity: Number(minQuantity),
      deliveryDays,
      image,
      description,
      isTopSelling,
      isPopular,
      quantityTiers: [
        {
          quantity: Number(minQuantity),
          pricePerUnit: Math.round(Number(basePrice) / Number(minQuantity)),
          totalPrice: Number(basePrice),
        },
        {
          quantity: Number(minQuantity) * 2,
          pricePerUnit: Math.round(
            (Number(basePrice) * 0.9) / Number(minQuantity),
          ),
          totalPrice: Math.round(Number(basePrice) * 1.8),
        },
        {
          quantity: Number(minQuantity) * 5,
          pricePerUnit: Math.round(
            (Number(basePrice) * 0.8) / Number(minQuantity),
          ),
          totalPrice: Math.round(Number(basePrice) * 4.0),
        },
      ],
      finishes: ["Matte Lamination", "Gloss Finish", "Spot UV Lamination"],
      paperStocks: ["350gsm Matte Artboard", "600gsm Cotton Cardstock"],
    };

    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDeleteProduct = async (prodSlug: string) => {
    if (
      !confirm("Are you sure you want to delete this commercial print product?")
    )
      return;
    await fetch(`/api/products/${prodSlug}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">
            Product Catalog Management
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Configure commercial print products, pricing in Naira (₦), and
            volume tiers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-card border border-border/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-soft border-b border-border/60 text-ink-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price (₦)</th>
                <th className="p-4">Min Qty</th>
                <th className="p-4">Delivery</th>
                <th className="p-4">Top Selling</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-ink">
              {products.map(prod => (
                <tr key={prod.slug} className="hover:bg-canvas-soft/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-theme overflow-hidden bg-canvas-soft shrink-0 border border-border/40">
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
                        <span className="text-[10px] text-ink-muted">
                          /{prod.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{prod.categoryName}</td>
                  <td className="p-4 font-bold text-ink">
                    ₦{prod.basePrice?.toLocaleString()}
                  </td>
                  <td className="p-4">{prod.minQuantity} pcs</td>
                  <td className="p-4">{prod.deliveryDays}</td>
                  <td className="p-4">
                    {prod.isTopSelling ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-pale text-primary">
                        Yes
                      </span>
                    ) : (
                      <span className="text-ink-muted text-[11px]">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteProduct(prod.slug)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete Product"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-card rounded-card border border-border max-w-lg w-full p-6 space-y-4 shadow-elevation">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display font-bold text-base text-ink">
                Add Commercial Print Product
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Curved Edge Luxury Business Cards"
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Category *
                </label>
                <select
                  value={categorySlug}
                  onChange={e => setCategorySlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                >
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    Starting Base Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={e => setBasePrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    Min Quantity (pcs) *
                  </label>
                  <input
                    type="number"
                    required
                    value={minQuantity}
                    onChange={e =>
                      setMinQuantity(parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Delivery Days
                </label>
                <input
                  type="text"
                  value={deliveryDays}
                  onChange={e => setDeliveryDays(e.target.value)}
                  placeholder="24-48 Hours"
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <R2ImageUpload
                label="Product Image "
                value={image}
                onChange={setImage}
                folder="products"
              />

              <div>
                <label className="block font-bold text-ink mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Specify material weight (GSM), finish options, and print process..."
                  className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTopSelling}
                    onChange={e => setIsTopSelling(e.target.checked)}
                    className="rounded"
                  />
                  <span className="font-semibold text-ink">
                    Feature on Top Selling Section
                  </span>
                </label>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
