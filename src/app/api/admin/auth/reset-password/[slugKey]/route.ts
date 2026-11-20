import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import {
  checkRateLimit,
  getClientIp,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimit";

const MAX_RESET_ATTEMPTS = 5;
const RESET_WINDOW_MS = 15 * 60 * 1000;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slugKey: string }> }
) {
  try {
    const envSlugKey = process.env.ADMIN_PASSWORD_SLUG_KEY;
    if (!envSlugKey) {
      return NextResponse.json(
        { error: "Password reset via slug key is not configured on this server." },
        { status: 500 }
      );
    }

    const ip = getClientIp(request);
    const rateLimitKey = `admin-reset:${ip}`;
    const { allowed, retryAfterSeconds } = checkRateLimit(rateLimitKey, MAX_RESET_ATTEMPTS);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many reset attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const { slugKey } = await params;
    if (!slugKey || slugKey !== envSlugKey) {
      recordFailedAttempt(rateLimitKey, RESET_WINDOW_MS);
      return NextResponse.json(
        { error: "Forbidden. Invalid slug key provided in URL path." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { newPassword, email } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password is required and must be at least 6 characters long." },
        { status: 400 }
      );
    }

    resetRateLimit(rateLimitKey);
    await connectDB();
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const filter =
      typeof email === "string" && email.trim()
        ? { email: email.toLowerCase().trim() }
        : {};
    const updated = await AdminUser.findOneAndUpdate(
      filter,
      { passwordHash: newPasswordHash },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Admin user not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin password successfully reset via slug key.",
      email: updated.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slugKey: string }> }
) {
  const envSlugKey = process.env.ADMIN_PASSWORD_SLUG_KEY;
  if (!envSlugKey) {
    return NextResponse.json(
      { valid: false, error: "Password reset via slug key is not configured." },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);
  const rateLimitKey = `admin-reset:${ip}`;
  const { allowed, retryAfterSeconds } = checkRateLimit(rateLimitKey, MAX_RESET_ATTEMPTS);
  if (!allowed) {
    return NextResponse.json(
      { valid: false, error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const { slugKey } = await params;
  if (!slugKey || slugKey !== envSlugKey) {
    recordFailedAttempt(rateLimitKey, RESET_WINDOW_MS);
    return NextResponse.json({ valid: false, error: "Invalid slug key" }, { status: 403 });
  }

  return NextResponse.json({
    valid: true,
    message:
      "Slug key is valid. Send a POST request with { newPassword: '...' } to update admin password.",
  });
}
