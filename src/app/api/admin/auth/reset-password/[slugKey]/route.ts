import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB, memoryStore } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { ensureSeeded } from "@/lib/seed";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slugKey: string }> }
) {
  try {
    await ensureSeeded();
    const { slugKey } = await params;
    const ENV_SLUG_KEY = process.env.ADMIN_PASSWORD_SLUG_KEY || "iceberg-secure-slug-key-2026";

    if (!slugKey || slugKey !== ENV_SLUG_KEY) {
      return NextResponse.json(
        { error: "Forbidden. Invalid slug key provided in URL path." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password is required and must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    memoryStore.adminUser.passwordHash = newPasswordHash;

    const db = await connectDB();
    if (db) {
      await AdminUser.findOneAndUpdate(
        { email: memoryStore.adminUser.email },
        { passwordHash: newPasswordHash },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin password successfully reset via slug key.",
      email: memoryStore.adminUser.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slugKey: string }> }
) {
  const { slugKey } = await params;
  const ENV_SLUG_KEY = process.env.ADMIN_PASSWORD_SLUG_KEY || "iceberg-secure-slug-key-2026";

  if (!slugKey || slugKey !== ENV_SLUG_KEY) {
    return NextResponse.json({ valid: false, error: "Invalid slug key" }, { status: 403 });
  }

  return NextResponse.json({
    valid: true,
    message: "Slug key is valid. Send a POST request with { newPassword: '...' } to update admin password.",
  });
}
