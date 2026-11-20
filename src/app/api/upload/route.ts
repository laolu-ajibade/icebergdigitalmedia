import { NextResponse } from "next/server";
import { uploadToR2, isR2Configured, getR2Config } from "@/lib/r2";
import { getAdminSession } from "@/lib/auth";
import { checkRateLimit, getClientIp, recordFailedAttempt } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_TYPES = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

const MAX_PUBLIC_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_ADMIN_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
const PUBLIC_UPLOAD_MAX_PER_WINDOW = 20;
const PUBLIC_UPLOAD_WINDOW_MS = 15 * 60 * 1000;

function sanitizeFolder(rawFolder: unknown): string {
  if (typeof rawFolder !== "string" || !rawFolder.trim()) {
    return "uploads";
  }
  const cleaned = rawFolder.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return cleaned || "uploads";
}

export async function POST(request: Request) {
  try {
    if (!isR2Configured()) {
      const cfg = getR2Config();
      return NextResponse.json(
        {
          error: "Cloudflare R2 is not fully configured.",
          details: {
            hasEndpoint: Boolean(cfg.endpoint),
            hasAccessKeyId: Boolean(cfg.accessKeyId),
            hasSecretAccessKey: Boolean(cfg.secretAccessKey),
            bucket: cfg.bucket,
          },
        },
        { status: 500 }
      );
    }

    const contentTypeHeader = request.headers.get("content-type") || "";

    // 1. Multipart Form Data Upload
    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = sanitizeFolder(formData.get("folder"));
      const isPublicLogoUpload = folder === "client-logos";

      if (!isPublicLogoUpload) {
        const session = await getAdminSession();
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else {
        const ip = getClientIp(request);
        const rateLimitKey = `public-upload:${ip}`;
        const { allowed, retryAfterSeconds } = checkRateLimit(
          rateLimitKey,
          PUBLIC_UPLOAD_MAX_PER_WINDOW
        );
        if (!allowed) {
          return NextResponse.json(
            { error: "Too many uploads. Please try again later." },
            { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
          );
        }
        recordFailedAttempt(rateLimitKey, PUBLIC_UPLOAD_WINDOW_MS);
      }

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
      }

      const ext = ALLOWED_IMAGE_TYPES.get(file.type.toLowerCase());
      if (!ext) {
        return NextResponse.json(
          { error: "Unsupported file type. Only PNG, JPEG, WebP, GIF, and AVIF images are allowed." },
          { status: 400 }
        );
      }

      const maxBytes = isPublicLogoUpload ? MAX_PUBLIC_UPLOAD_BYTES : MAX_ADMIN_UPLOAD_BYTES;
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `File exceeds maximum allowed size (${Math.round(maxBytes / (1024 * 1024))} MB).` },
          { status: 413 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const originalName = file.name || "upload";
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const key = `iceberg/${folder}/${timestamp}-${random}.${ext}`;

      const publicUrl = await uploadToR2(buffer, key, file.type);

      return NextResponse.json({
        success: true,
        url: publicUrl,
        key,
        originalName,
        size: file.size,
        contentType: file.type,
      });
    }

    // 2. JSON Base64 or DataURL Upload (Admin only)
    if (contentTypeHeader.includes("application/json")) {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { base64, dataUrl, filename } = body;
      const folder = sanitizeFolder(body.folder);

      let rawBase64 = base64;
      let mimeType = "image/png";

      if (dataUrl && typeof dataUrl === "string") {
        const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1].toLowerCase();
          rawBase64 = match[2];
        }
      }

      if (!rawBase64 || typeof rawBase64 !== "string") {
        return NextResponse.json({ error: "base64 or dataUrl required." }, { status: 400 });
      }

      const ext = ALLOWED_IMAGE_TYPES.get(mimeType);
      if (!ext) {
        return NextResponse.json(
          { error: "Unsupported image MIME type." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(rawBase64, "base64");
      if (buffer.length > MAX_ADMIN_UPLOAD_BYTES) {
        return NextResponse.json(
          { error: `File exceeds maximum allowed size (${Math.round(MAX_ADMIN_UPLOAD_BYTES / (1024 * 1024))} MB).` },
          { status: 413 }
        );
      }

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const safeFilename =
        typeof filename === "string" && filename.trim()
          ? filename.replace(/[^a-zA-Z0-9.-]/g, "_")
          : `proof-${timestamp}`;
      const key = `iceberg/${folder}/${safeFilename}-${random}.${ext}`;

      const publicUrl = await uploadToR2(buffer, key, mimeType);

      return NextResponse.json({
        success: true,
        url: publicUrl,
        key,
        size: buffer.length,
        contentType: mimeType,
      });
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type. Use multipart/form-data or application/json." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Cloudflare R2 Upload API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to upload to Cloudflare R2",
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
