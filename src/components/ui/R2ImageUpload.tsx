"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, AlertCircle, Loader2 } from "lucide-react";

export function isValidImageSrc(src?: string): boolean {
  if (!src) return false;
  const trimmed = src.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("data:")) return true;
  try {
    const u = new URL(trimmed);
    return (u.protocol === "http:" || u.protocol === "https:") && Boolean(u.hostname);
  } catch {
    return false;
  }
}

interface R2ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  placeholder?: string;
}

export function R2ImageUpload({
  value,
  onChange,
  label = "Image",
  folder = "products",
  placeholder = "Paste image URL or upload file...",
}: R2ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2.5 text-xs">
      <label className="block font-bold text-ink">{label}</label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 min-h-[42px] rounded-button bg-canvas-soft border border-border text-ink text-xs focus:outline-none focus:border-primary"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-button bg-canvas-soft border border-border hover:border-primary text-ink text-xs font-bold cursor-pointer transition-colors disabled:opacity-50 shrink-0"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              <span>Upload</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {isValidImageSrc(value) && (
        <div className="relative w-28 h-28 rounded-theme overflow-hidden bg-canvas-soft border border-border">
          <Image
            src={value.trim()}
            alt="Uploaded preview"
            fill
            unoptimized={value.startsWith("data:")}
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            title="Remove Image"
            aria-label="Remove Image"
            className="absolute top-1.5 right-1.5 p-1.5 rounded-button bg-red-600 hover:bg-red-700 text-white shadow-soft transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

interface R2MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  folder?: string;
  showPrimaryBadge?: boolean;
}

export function R2MultiImageUpload({
  values,
  onChange,
  label = "Images",
  folder = "products",
  showPrimaryBadge = false,
}: R2MultiImageUploadProps) {
  const [linkInput, setLinkInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          uploaded.push(data.url);
        } else {
          throw new Error(data.error || "Upload failed");
        }
      }
      if (uploaded.length > 0) {
        onChange([...values, ...uploaded]);
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;
    if (!isValidImageSrc(trimmed)) {
      setUploadError("Please enter a valid http:// or https:// image URL.");
      return;
    }
    setUploadError(null);
    onChange([...values, trimmed]);
    setLinkInput("");
  };

  const handleSetPrimary = (idx: number) => {
    const selected = values[idx];
    const rest = values.filter((_, i) => i !== idx);
    onChange([selected, ...rest]);
  };

  const handleRemove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  const validList = values.filter(isValidImageSrc);

  return (
    <div className="space-y-2.5 text-xs">
      <label className="block font-bold text-ink">
        {label} ({validList.length})
      </label>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="Paste image URL link..."
            className="flex-1 px-3.5 py-2.5 min-h-[42px] rounded-button bg-card border border-border text-ink text-xs focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="px-4 py-2.5 min-h-[42px] rounded-button bg-card border border-border hover:border-primary text-ink font-bold cursor-pointer shrink-0"
          >
            Add Link
          </button>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-button bg-card border border-border hover:border-primary text-ink font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
            )}
            <span>{isUploading ? "Uploading..." : "Upload"}</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {validList.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
          {validList.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`relative h-24 rounded-theme overflow-hidden border-2 bg-card ${
                showPrimaryBadge && idx === 0 ? "border-primary" : "border-border"
              }`}
            >
              <Image
                src={imgUrl.trim()}
                alt={`Image ${idx + 1}`}
                fill
                unoptimized={imgUrl.startsWith("data:")}
                className="object-cover"
              />
              {showPrimaryBadge &&
                (idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold">
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-ink/80 text-white text-[9px] font-semibold cursor-pointer"
                  >
                    Set Primary
                  </button>
                ))}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1.5 rounded-button bg-red-600 hover:bg-red-700 text-white shadow-soft transition-colors cursor-pointer"
                title="Delete Image"
                aria-label="Delete Image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
