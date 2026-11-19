import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createAdminToken, getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  checkRateLimit,
  getClientIp,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimit";
import { AdminUser } from "@/models/AdminUser";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `admin-login:${ip}`;
    const { allowed, retryAfterSeconds } = checkRateLimit(
      rateLimitKey,
      MAX_LOGIN_ATTEMPTS
    );

    if (!allowed) {
      const waitMinutes = Math.ceil(retryAfterSeconds / 60);
      return NextResponse.json(
        {
          error: `Too many failed sign-in attempts. Please try again in ${waitMinutes} minute${waitMinutes === 1 ? "" : "s"}.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      recordFailedAttempt(rateLimitKey, LOGIN_WINDOW_MS);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      recordFailedAttempt(rateLimitKey, LOGIN_WINDOW_MS);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    resetRateLimit(rateLimitKey);

    const token = await createAdminToken({ email: admin.email, role: admin.role });
    const cookieStore = await cookies();
    cookieStore.set("iceberg_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { email: admin.email, role: admin.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, user: session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("iceberg_admin_token");
  return NextResponse.json({ success: true });
}
