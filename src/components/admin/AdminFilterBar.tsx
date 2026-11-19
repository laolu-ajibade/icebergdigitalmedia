"use client";

import React from "react";
import { Search, ChevronDown, type LucideIcon } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDropdownConfig {
  key: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  allLabel: string;
  icon: LucideIcon;
  ariaLabel?: string;
}

interface AdminFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters?: FilterDropdownConfig[];
}

/**
 * Shared pill-styled search and filter toolbar for Admin registers.
 */
export function AdminFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  filters = [],
}: AdminFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-11 pr-4 py-2.5 min-h-[44px] rounded-full bg-card border border-border/80 text-xs text-ink placeholder:text-ink-muted shadow-soft focus:outline-none focus:border-primary"
        />
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <div key={filter.key} className="relative">
                <Icon className="w-3.5 h-3.5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  aria-label={filter.ariaLabel || filter.allLabel}
                  className="pl-9 pr-9 py-2.5 min-h-[44px] appearance-none rounded-full bg-card border border-border/80 text-xs font-bold text-ink shadow-soft cursor-pointer focus:outline-none focus:border-primary"
                >
                  <option value="all">{filter.allLabel}</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
