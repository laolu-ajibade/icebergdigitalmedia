import { NextResponse } from "next/server";
import { uploadToR2, isR2Configured, getR2Config } from "@/lib/r2";

export const dynamic = "force-dynamic";

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
      const folder = (formData.get("folder") as string) || "uploads";

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = file.name || "upload";
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const ext = sanitizedName.split(".").pop() || "png";
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const key = `iceberg/${folder}/${timestamp}-${random}.${ext}`;

      const publicUrl = await uploadToR2(buffer, key, file.type || "application/octet-stream");

      return NextResponse.json({
        success: true,
        url: publicUrl,
        key,
        originalName,
        size: file.size,
        contentType: file.type,
      });
    }

    // 2. JSON Base64 or DataURL Upload
    if (contentTypeHeader.includes("application/json")) {
      const body = await request.json();
      const { base64, dataUrl, filename, folder = "uploads" } = body;

      let rawBase64 = base64;
      let mimeType = "image/png";

      if (dataUrl && typeof dataUrl === "string") {
        const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          rawBase64 = match[2];
        }
      }

      if (!rawBase64) {
        return NextResponse.json({ error: "base64 or dataUrl required." }, { status: 400 });
      }

      const buffer = Buffer.from(rawBase64, "base64");
      const ext = mimeType.split("/")[1] || "png";
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const safeFilename = filename ? filename.replace(/[^a-zA-Z0-9.-]/g, "_") : `proof-${timestamp}`;
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
