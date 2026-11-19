import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tag } from "@/models/Tag";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const tags = await Tag.find().sort({ order: 1 });
    return NextResponse.json({ tags });
  } catch (error: any) {
    return NextResponse.json({ tags: [], error: error.message }, { status: 500 });
  }
}
