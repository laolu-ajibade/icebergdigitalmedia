import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slugKey, currentPassword, newPassword } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password is required and must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDB();
    const admin = await AdminUser.findOne();
    if (!admin) {
      return NextResponse.json({ error: "Admin user not found in database." }, { status: 404 });
    }

    const ENV_SLUG_KEY =
      process.env.ADMIN_PASSWORD_SLUG_KEY || "iceberg-secure-slug-key-2026";
    let isAuthorized = false;

    if (slugKey && slugKey === ENV_SLUG_KEY) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      const session = await getAdminSession();
      if (session && currentPassword) {
        const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
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
        {
          error:
            "Unauthorized. A valid slugKey or active admin session with current password is required.",
        },
        { status: 403 }
      );
    }

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
