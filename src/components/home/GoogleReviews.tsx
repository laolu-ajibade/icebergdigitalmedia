"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  MessageSquarePlus,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export function GoogleReviews() {
  const [reviewsData, setReviewsData] = useState<any>({
    rating: 5.0,
    totalReviews: 0,
    reviews: [],
    googleReviewUrl: "https://g.page/r/CWhgADsBIJ2QEBM/review",
    googleMapsUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJvQSY9_iNOxARaGAAOwEgnZA",
  });

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviewsData(data);
      })
      .catch((err) => {
        console.error("[Google Reviews] Failed to fetch /api/reviews:", err);
      });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-canvas-soft border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Overall Google Score */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* Google Brand G Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.67-5.17 3.67-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.25 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.24A7.18 7.18 0 0 1 4.9 12c0-.78.14-1.53.37-2.24V6.61H1.25A11.967 11.967 0 0 0 0 12c0 1.92.45 3.74 1.25 5.39l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              <span className="text-xs font-bold text-ink tracking-wide uppercase">
                Google Business Verified Reviews
              </span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
              Trusted by 500+ Lagos Brands & Designers
            </h2>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="font-display font-black text-lg text-ink">
                {reviewsData.rating} / 5.0
              </span>
              <span className="text-xs text-ink-muted">
                ({reviewsData.totalReviews}+ Verified Customer Impressions)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={
                reviewsData.googleReviewUrl ||
                "https://g.page/r/CWhgADsBIJ2QEBM/review"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review on Google</span>
            </a>

            <a
              href={
                reviewsData.googleMapsUrl ||
                "https://www.google.com/maps/place/?q=place_id:ChIJvQSY9_iNOxARaGAAOwEgnZA"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button bg-card border border-border text-ink font-semibold text-xs hover:bg-canvas transition-colors"
            >
              <span>View All on Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Top Verified Reviews Cards */}
        {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsData.reviews.slice(0, 6).map((rev: any, index: number) => (
              <div
                key={index}
                className="bg-card rounded-card border border-border/80 p-6 shadow-soft antigravity-card flex flex-col justify-between"
              >
                <div>
                  {/* Rating & Timestamp */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-ink-muted">
                      {rev.relativeTimeDescription}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-ink-body leading-relaxed italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rev.authorPhoto ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-canvas-soft border border-border/40 shrink-0">
                          <Image
                            src={rev.authorPhoto}
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
                        <span className="text-[10px] text-ink-muted block">
                          Verified Google Customer
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold"
                      title="Verified Review"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Owner Response if present */}
                  {rev.ownerResponse && (
                    <div className="mt-3.5 pt-3 border-t border-border/30 bg-canvas-soft/70 rounded-theme p-3 text-[11px] text-ink-muted">
                      <span className="font-bold text-ink text-[11px] block mb-1">
                        Response from Iceberg Studio:
                      </span>
                      <p className="italic leading-relaxed text-ink-body">
                        &ldquo;{rev.ownerResponse}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-card border border-border/80 p-8 text-center max-w-xl mx-auto shadow-soft space-y-3">
            <h3 className="font-display font-bold text-base text-ink">
              Have you printed with Iceberg Creative Print Studio?
            </h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Share your experience and print quality feedback with our Shomolu,
              Lagos production house on Google.
            </p>
            <div className="pt-2">
              <a
                href={
                  reviewsData.googleReviewUrl ||
                  "https://g.page/r/CWhgADsBIJ2QEBM/review"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Leave a Review on Google</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
