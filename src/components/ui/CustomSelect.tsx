"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Select an option",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full px-4 py-3 min-h-[44px] rounded-button bg-canvas-soft border text-left text-xs font-semibold text-ink flex items-center justify-between gap-3 cursor-pointer transition-colors focus:outline-none ${
          open ? "border-primary bg-card" : "border-border hover:border-ink/40"
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-card border border-border rounded-theme shadow-elevation py-1.5 max-h-60 overflow-y-auto"
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`px-4 py-2.5 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary-pale text-primary font-bold"
                    : "text-ink font-medium hover:bg-canvas-soft"
                }`}
              >
                <span>{option}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
