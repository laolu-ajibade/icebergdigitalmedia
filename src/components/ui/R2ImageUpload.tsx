"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, AlertCircle, Loader2 } from "lucide-react";

interface R2ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function R2ImageUpload({
  value,
  onChange,
  label = "Image",
  folder = "products",
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
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-ink">{label}</label>
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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-button bg-canvas-soft border border-border hover:border-primary text-ink text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              <span>{value ? "Change Image" : "Upload Image"}</span>
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

      {value && (
        <div className="relative w-28 h-28 rounded-theme overflow-hidden bg-canvas-soft border border-border group">
          <Image
            src={value}
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
