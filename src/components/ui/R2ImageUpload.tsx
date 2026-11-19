"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Check, AlertCircle, Loader2 } from "lucide-react";

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
  label = "Upload Image (Cloudflare R2)",
  folder = "products",
  placeholder = "https://pub-...r2.dev/...",
}: R2ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setIsSuccess(false);

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
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      console.error("Upload to Cloudflare R2 failed:", err);
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-ink">{label}</label>
        {isSuccess && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" />
            Uploaded to R2
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink text-xs focus:outline-hidden focus:border-primary"
          />
        </div>

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
          className="flex items-center gap-1.5 px-3 py-2 rounded-button bg-canvas border border-border hover:border-primary text-ink text-xs font-medium cursor-pointer transition-colors disabled:opacity-50 shrink-0"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              <span>Browse</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-600">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {value && (
        <div className="mt-2 flex items-center gap-3 p-2 rounded-button bg-canvas-soft border border-border/60">
          <div className="w-10 h-10 rounded-button overflow-hidden bg-ink/5 border border-border/50 shrink-0 relative">
            <Image
              src={value}
              alt="Preview"
              width={40}
              height={40}
              unoptimized={value.startsWith("data:")}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-ink font-mono truncate">{value}</p>
            <p className="text-[10px] text-ink-muted">Cloudflare R2 Asset</p>
          </div>
        </div>
      )}
    </div>
  );
}
