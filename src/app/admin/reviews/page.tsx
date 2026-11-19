"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle,
  ChevronDown,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/context/ToastContext";
import { clearSiteSettingsCache } from "@/lib/useSiteSettings";

interface ReviewItem {
  _id?: string;
  id?: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  reviewDate: string;
  text: string;
  photos?: string[];
  responseFromOwner?: string;
  responseDate?: string;
  isVerified?: boolean;
  featured?: boolean;
  order?: number;
  source?: string;
}

const PAGE_SIZE = 6;

export default function AdminReviewsPage() {
  const { showError, showSuccess, showPopup } = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [trustedCount, setTrustedCount] = useState("500+");
  const [customRating, setCustomRating] = useState<string>("");
  const [calculatedRating, setCalculatedRating] = useState<number>(5.0);
  const [savingHeader, setSavingHeader] = useState(false);

  const [formData, setFormData] = useState<ReviewItem>({
    authorName: "",
    rating: 5,
    reviewDate: "Recently",
    text: "",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 0,
    source: "google",
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?all=true");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
      if (data.trustedCount) {
        setTrustedCount(data.trustedCount);
      }
      if (typeof data.calculatedRating === "number") {
        setCalculatedRating(data.calculatedRating);
      }
      if (data.customRating && Number(data.customRating) > 0) {
        setCustomRating(String(data.customRating));
      } else {
        setCustomRating("");
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHeaderConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHeader(true);
    try {
      const parsedRating = customRating.trim() ? Number(customRating) : 0;
      if (parsedRating < 0 || parsedRating > 5) {
        showError("Overall rating must be between 0 and 5.0.", "Invalid Rating");
        return;
      }
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewsTrustedCount: trustedCount.trim() || "500+",
          reviewsOverallRating: parsedRating,
        }),
      });
      if (!res.ok) throw new Error("Failed to update reviews header settings");
      clearSiteSettingsCache();
      showSuccess("Reviews header count and rating score updated.", "Header Saved");
      fetchReviews();
    } catch (err: any) {
      showError(err.message || "Failed to update header settings.", "Save Failed");
    } finally {
      setSavingHeader(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreateModal = () => {
    setSelectedReview(null);
    setFormData({
      authorName: "",
      rating: 5,
      reviewDate: "Recently",
      text: "",
      photos: [],
      responseFromOwner: "",
      responseDate: "",
      isVerified: true,
      featured: true,
      order: reviews.length + 1,
      source: "google",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rev: ReviewItem) => {
    setSelectedReview(rev);
    setFormData({
      authorName: rev.authorName,
      authorImage: rev.authorImage || "",
      rating: rev.rating || 5,
      reviewDate: rev.reviewDate || "Recently",
      text: rev.text || "",
      photos: rev.photos || [],
      responseFromOwner: rev.responseFromOwner || "",
      responseDate: rev.responseDate || "",
      isVerified: rev.isVerified !== false,
      featured: rev.featured !== false,
      order: rev.order || 0,
      source: rev.source || "google",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName || !formData.text) {
      showError("Please provide the author name and review text.", "Validation Error");
      return;
    }

    setSaving(true);
    try {
      const reviewId = selectedReview?._id || selectedReview?.id;
      if (reviewId) {
        const res = await fetch(`/api/reviews/${reviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update review");
        }
        showSuccess("Customer review updated.", "Review Saved");
      } else {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create review");
        }
        showSuccess("New customer review added.", "Review Created");
      }
      setIsModalOpen(false);
      fetchReviews();
    } catch (err: any) {
      const msg = err.message || "Failed to save review";
      showError(msg, "Review Error");
      showPopup({
        type: "error",
        title: "Failed to Save Review",
        message: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this customer review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
        showSuccess("Review deleted from database.", "Deleted");
      } else {
        showError("Failed to delete review.", "Delete Failed");
      }
    } catch {
      showError("Network error while deleting review.", "Connection Error");
    }
  };

  const toggleFeatured = async (rev: ReviewItem) => {
    const revId = rev._id || rev.id;
    if (!revId) return;
    const newStatus = !rev.featured;
    try {
      const res = await fetch(`/api/reviews/${revId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newStatus }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            (r._id || r.id) === revId ? { ...r, featured: newStatus } : r
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === "all" || r.rating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
            Reviews
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Manage authentic customer reviews, ratings, owner replies, and verified print photos shown on the homepage.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Dynamic Reviews Header & Score Configuration */}
      <form
        onSubmit={handleSaveHeaderConfig}
        className="bg-card p-5 rounded-card border border-border shadow-soft space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h2 className="font-display font-bold text-sm text-ink">
              Homepage Reviews Header & Score Configuration
            </h2>
            <p className="text-[11px] text-ink-muted">
              Configure the dynamic brand count (&ldquo;Trusted by {trustedCount || "500+"} Lagos Brands &amp; Designers&rdquo;) and overall rating score ({customRating ? Number(customRating).toFixed(1) : calculatedRating.toFixed(1)} / 5.0).
            </p>
          </div>
          <button
            type="submit"
            disabled={savingHeader}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[38px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft shrink-0 cursor-pointer"
          >
            {savingHeader ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{savingHeader ? "Saving..." : "Save Header Metrics"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Trusted Brands / Clients Count (Headline Figure)
            </label>
            <input
              type="text"
              value={trustedCount}
              onChange={(e) => setTrustedCount(e.target.value)}
              placeholder="e.g. 500+, 1,000+"
              className="w-full px-3.5 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-xs font-semibold text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Overall Rating Score (Out of 5.0 · Leave empty for live average:{" "}
              {calculatedRating.toFixed(1)} / 5.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={customRating}
              onChange={(e) => setCustomRating(e.target.value)}
              placeholder={`Auto (${calculatedRating.toFixed(1)})`}
              className="w-full px-3.5 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-xs font-semibold text-ink focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-card border border-border shadow-soft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search author or review copy..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="text-xs font-semibold text-ink-muted shrink-0">
            Filter by Stars:
          </label>
          <div className="relative w-full sm:w-48">
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                );
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none bg-canvas-soft border border-border rounded-button text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:border-primary"
            >
              <option value="all">All Star Ratings</option>
              <option value={5}>5 Stars ★★★★★</option>
              <option value={4}>4 Stars ★★★★</option>
              <option value={3}>3 Stars ★★★</option>
            </select>
            <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-ink-muted space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs">Loading authentic reviews...</span>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-card border border-border">
          <p className="text-sm text-ink-muted">
            No reviews match your search criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReviews.map((rev) => {
              const revId = rev._id || rev.id;
              return (
                <div
                  key={revId}
                  className="bg-card rounded-card border border-border p-6 shadow-soft flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-ink-muted">
                        {rev.reviewDate}
                      </span>
                    </div>

                    <p className="text-xs text-ink-body leading-relaxed italic line-clamp-4">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rev.authorImage ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-canvas-soft border border-border/50 shrink-0">
                          <Image
                            src={rev.authorImage}
                            alt={rev.authorName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary-pale text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {rev.authorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-display font-bold text-xs text-ink">
                          {rev.authorName}
                        </h4>
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <CheckCircle className="w-3 h-3" />
                          <span>
                            {rev.featured ? "Active on Home" : "Hidden from Home"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFeatured(rev)}
                        title={
                          rev.featured
                            ? "Hide from homepage"
                            : "Show on homepage"
                        }
                        className={`px-2.5 py-1 rounded-button text-[10px] font-bold transition-colors cursor-pointer ${
                          rev.featured
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-canvas-soft text-ink-muted hover:bg-border"
                        }`}
                      >
                        {rev.featured ? "Published" : "Draft"}
                      </button>
                      <button
                        onClick={() => openEditModal(rev)}
                        className="p-2 rounded-button text-ink-muted hover:text-primary hover:bg-canvas-soft transition-colors cursor-pointer"
                        title="Edit Review"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(revId)}
                        className="p-2 rounded-button text-ink-muted hover:text-red-600 hover:bg-canvas-soft transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-card p-4 rounded-card border border-border shadow-soft">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredReviews.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-xl rounded-card border border-border shadow-elevation p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display font-black text-lg text-ink">
                {selectedReview ? "Edit Customer Review" : "Add Verified Review"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-button text-ink-muted hover:text-ink hover:bg-canvas-soft cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData({ ...formData, authorName: e.target.value })
                    }
                    placeholder="e.g. Oloyede Godliness"
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    Rating (Stars)
                  </label>
                  <div className="relative">
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none bg-canvas-soft border border-border rounded-button text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:border-primary"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★</option>
                      <option value={3}>3 Stars ★★★</option>
                      <option value={2}>2 Stars ★★</option>
                      <option value={1}>1 Star ★</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Relative Time / Date *
                </label>
                <input
                  type="text"
                  required
                  value={formData.reviewDate}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewDate: e.target.value })
                  }
                  placeholder="e.g. a week ago, 2 months ago"
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Review Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  placeholder="Enter the full customer review statement..."
                  className="w-full px-3.5 py-2.5 bg-canvas-soft border border-border rounded-button text-xs text-ink focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <R2ImageUpload
                label="Reviewer Profile Image"
                folder="reviews"
                value={formData.authorImage || ""}
                onChange={(authorImage) =>
                  setFormData({ ...formData, authorImage })
                }
              />

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                  />
                  <span>Show on Homepage Reviews Section</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-ink font-semibold text-xs hover:bg-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
