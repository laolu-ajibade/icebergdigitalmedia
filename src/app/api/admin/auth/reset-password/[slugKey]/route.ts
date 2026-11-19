import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slugKey: string }> }
) {
  try {
    const { slugKey } = await params;
    const ENV_SLUG_KEY =
      process.env.ADMIN_PASSWORD_SLUG_KEY || "iceberg-secure-slug-key-2026";

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

    await connectDB();
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updated = await AdminUser.findOneAndUpdate(
      {},
      { passwordHash: newPasswordHash },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Admin password successfully reset via slug key.",
      email: updated?.email || "admin@icebergprints.com",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slugKey: string }> }
) {
  const { slugKey } = await params;
  const ENV_SLUG_KEY =
    process.env.ADMIN_PASSWORD_SLUG_KEY || "iceberg-secure-slug-key-2026";

  if (!slugKey || slugKey !== ENV_SLUG_KEY) {
    return NextResponse.json({ valid: false, error: "Invalid slug key" }, { status: 403 });
  }

  return NextResponse.json({
    valid: true,
    message:
      "Slug key is valid. Send a POST request with { newPassword: '...' } to update admin password.",
  });
}
