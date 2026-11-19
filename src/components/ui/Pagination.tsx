"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs">
      <span className="text-ink-muted">
        Showing <strong className="text-ink">{startItem}</strong>–
        <strong className="text-ink">{endItem}</strong> of{" "}
        <strong className="text-ink">{totalItems}</strong>
      </span>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="p-2 min-h-[36px] min-w-[36px] rounded-button bg-card border border-border text-ink hover:bg-canvas-soft disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 min-h-[36px] min-w-[36px] rounded-button font-bold transition-colors cursor-pointer ${
                p === currentPage
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border text-ink-body hover:bg-canvas-soft"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="p-2 min-h-[36px] min-w-[36px] rounded-button bg-card border border-border text-ink hover:bg-canvas-soft disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
