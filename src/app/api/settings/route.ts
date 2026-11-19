import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return NextResponse.json({ settings: null }, { status: 404 });
    }

    const obj = settings.toObject();
    if (!obj.googlePlaceId && process.env.GOOGLE_PLACE_ID) {
      obj.googlePlaceId = process.env.GOOGLE_PLACE_ID;
    }
    obj.googleApiKey = "••••••••••••••••••••••••••••••••••••";
    if (!obj.phone && process.env.NEXT_PUBLIC_CONTACT_PHONE) {
      obj.phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
    }
    if (!obj.whatsappRouting && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
      obj.whatsappRouting = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    }

    return NextResponse.json({ settings: obj });
  } catch (error: any) {
    return NextResponse.json({ settings: null, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    delete data.googlePlaceId;
    delete data.googleApiKey;
    await connectDB();

    const updated = await SiteSettings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return NextResponse.json({ settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
