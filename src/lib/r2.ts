import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export function getR2Config() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.replace(/^["']|["']$/g, "");
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.replace(/^["']|["']$/g, "");
  const bucket = (process.env.R2_BUCKET || "coravents").replace(/^["']|["']$/g, "");
  const publicUrl = (
    process.env.R2_PUBLIC_URL || "https://pub-91aeee2720ed468690380aee96842095.r2.dev"
  )
    .replace(/^["']|["']$/g, "")
    .replace(/\/+$/, "");

  return { endpoint, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export function isR2Configured(): boolean {
  const { endpoint, accessKeyId, secretAccessKey } = getR2Config();
  return Boolean(endpoint && accessKeyId && secretAccessKey);
}

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!s3ClientInstance) {
    const config = getR2Config();
    if (!config.endpoint || !config.accessKeyId || !config.secretAccessKey) {
      throw new Error(
        "Cloudflare R2 credentials missing from environment (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)."
      );
    }

    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return s3ClientInstance;
}

/**
 * Upload a file buffer directly to Cloudflare R2 and return its public URL.
 */
export async function uploadToR2(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<string> {
  const client = getR2Client();
  const config = getR2Config();
  const cleanKey = key.replace(/^\/+/, "");

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  return `${config.publicUrl}/${cleanKey}`;
}

/**
 * Delete a file object from Cloudflare R2 by its key.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  const config = getR2Config();
  const cleanKey = key.replace(/^\/+/, "");

  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
  });

  await client.send(command);
}

export function getR2PublicUrl(key: string): string {
  const config = getR2Config();
  const cleanKey = key.replace(/^\/+/, "");
  return `${config.publicUrl}/${cleanKey}`;
}
