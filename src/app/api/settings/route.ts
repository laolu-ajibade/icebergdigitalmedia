import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await ensureSeeded();
    const db = await connectDB();
    if (db) {
      const settings = await SiteSettings.findOne();
      if (settings) {
        const obj = settings.toObject();
        if (!obj.googlePlaceId && process.env.GOOGLE_PLACE_ID) {
          obj.googlePlaceId = process.env.GOOGLE_PLACE_ID;
        }
        if (!obj.googleApiKey && process.env.GOOGLE_API_KEY) {
          obj.googleApiKey = process.env.GOOGLE_API_KEY;
        }
        if (process.env.NEXT_PUBLIC_CONTACT_PHONE) {
          obj.phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
        }
        if (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
          obj.whatsappRouting = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
        }
        return NextResponse.json({ settings: obj });
      }
    }
    const memSettings = { ...memoryStore.settings };
    if (!memSettings.googlePlaceId && process.env.GOOGLE_PLACE_ID) {
      memSettings.googlePlaceId = process.env.GOOGLE_PLACE_ID;
    }
    if (!memSettings.googleApiKey && process.env.GOOGLE_API_KEY) {
      memSettings.googleApiKey = process.env.GOOGLE_API_KEY;
    }
    if (process.env.NEXT_PUBLIC_CONTACT_PHONE) {
      memSettings.phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
    }
    if (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
      memSettings.whatsappRouting = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    }
    return NextResponse.json({ settings: memSettings });
  } catch (error: any) {
    return NextResponse.json({ settings: memoryStore.settings, error: error.message });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const db = await connectDB();
    if (db) {
      const updated = await SiteSettings.findOneAndUpdate({}, data, { new: true, upsert: true });
      memoryStore.settings = updated.toObject();
      return NextResponse.json({ settings: updated });
    }

    memoryStore.settings = { ...memoryStore.settings, ...data };
    return NextResponse.json({ settings: memoryStore.settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
