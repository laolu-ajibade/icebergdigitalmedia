import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB, memoryStore } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const { slugKey, currentPassword, newPassword } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password is required and must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const ENV_SLUG_KEY = process.env.ADMIN_PASSWORD_SLUG_KEY || "iceberg-secure-slug-key-2026";
    let isAuthorized = false;

    // Method 1: Authorized via ENV Slug Key
    if (slugKey && slugKey === ENV_SLUG_KEY) {
      isAuthorized = true;
    }

    // Method 2: Authorized via Authenticated Admin Session + Current Password
    if (!isAuthorized) {
      const session = await getAdminSession();
      if (session && currentPassword) {
        const isCurrentValid = await bcrypt.compare(
          currentPassword,
          memoryStore.adminUser.passwordHash
        );
        if (isCurrentValid) {
          isAuthorized = true;
        } else {
          return NextResponse.json(
            { error: "Current password does not match existing records." },
            { status: 401 }
          );
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. A valid slugKey or active admin session with current password is required." },
        { status: 403 }
      );
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update in-memory store
    memoryStore.adminUser.passwordHash = newPasswordHash;

    // Update MongoDB if connected
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
      message: "Admin password has been updated successfully.",
      email: memoryStore.adminUser.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
