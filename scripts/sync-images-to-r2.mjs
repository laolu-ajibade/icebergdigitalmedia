import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET || "coravents";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "https://pub-91aeee2720ed468690380aee96842095.r2.dev").replace(/\/+$/, "");

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("Missing R2 credentials in environment!");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const mimeMap = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const filesToUpload = [
  "public/images/products/boxes.jpg",
  "public/images/products/clothes.jpg",
  "public/images/products/cups.jpg",
  "public/images/products/bags.jpg",
  "public/images/products/banner.jpg",
  "public/images/products/business-cards.jpg",
  "public/logo.png",
  "public/logo-icon.jpg",
  "public/favicon.ico",
];

async function sync() {
  console.log(`Syncing ${filesToUpload.length} files to Cloudflare R2 bucket: ${R2_BUCKET}`);
  const uploadedUrls = {};

  for (const relPath of filesToUpload) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(relPath).toLowerCase();
    const contentType = mimeMap[ext] || "application/octet-stream";
    // Key in R2 (e.g. iceberg/images/products/boxes.jpg or images/products/boxes.jpg)
    const key = relPath.replace(/^public\//, "iceberg/");

    console.log(`Uploading ${relPath} -> key: ${key} (${contentType})...`);

    const cmd = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3.send(cmd);
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    uploadedUrls[relPath] = publicUrl;
    console.log(`✓ Uploaded: ${publicUrl}`);
  }

  console.log("\nAll files successfully synced to Cloudflare R2!");
  console.log(JSON.stringify(uploadedUrls, null, 2));
}

sync().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
