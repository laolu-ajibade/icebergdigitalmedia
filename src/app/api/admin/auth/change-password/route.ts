import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { getAdminSession } from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `admin-change-pw:${ip}`;
    const { allowed, retryAfterSeconds } = checkRateLimit(rateLimitKey, MAX_ATTEMPTS);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many password change attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { slugKey, currentPassword, newPassword, email } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password is required and must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDB();

    const envSlugKey = process.env.ADMIN_PASSWORD_SLUG_KEY;
    const session = await getAdminSession();
    let isAuthorized = false;
    let admin: any = null;

    if (slugKey) {
      if (envSlugKey && slugKey === envSlugKey) {
        const filter =
          typeof email === "string" && email.trim()
            ? { email: email.toLowerCase().trim() }
            : {};
        admin = await AdminUser.findOne(filter);
        if (!admin) {
          return NextResponse.json({ error: "Admin user not found in database." }, { status: 404 });
        }
        isAuthorized = true;
      } else {
        recordFailedAttempt(rateLimitKey, WINDOW_MS);
        return NextResponse.json({ error: "Invalid slugKey." }, { status: 403 });
      }
    }

    if (!isAuthorized && session && currentPassword) {
      const sessionEmail =
        typeof session.email === "string" ? session.email.toLowerCase().trim() : "";
      admin = sessionEmail
        ? await AdminUser.findOne({ email: sessionEmail })
        : await AdminUser.findOne();
      if (!admin) {
        return NextResponse.json({ error: "Admin user not found in database." }, { status: 404 });
      }
      const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (isCurrentValid) {
        isAuthorized = true;
      } else {
        recordFailedAttempt(rateLimitKey, WINDOW_MS);
        return NextResponse.json(
          { error: "Current password does not match existing records." },
          { status: 401 }
        );
      }
    }

    if (!isAuthorized || !admin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. A valid slugKey or active admin session with current password is required.",
        },
        { status: 403 }
      );
    }

    resetRateLimit(rateLimitKey);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    admin.passwordHash = newPasswordHash;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Admin password has been updated successfully.",
      email: admin.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
