import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { pickFields } from "@/lib/pick";

export const dynamic = "force-dynamic";

const PRODUCT_FIELDS = [
  "title",
  "slug",
  "categorySlug",
  "categoryName",
  "description",
  "basePrice",
  "minQuantity",
  "deliveryDays",
  "image",
  "gallery",
  "paperStocks",
  "finishes",
  "quantityTiers",
  "isPopular",
  "isTopSelling",
  "specifications",
] as const;

const byIdOrSlug = (id: string) =>
  mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findOne(byIdOrSlug(id));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const raw = await request.json();
    const data = pickFields(raw, PRODUCT_FIELDS);
    await connectDB();

    const updated = await Product.findOneAndUpdate(byIdOrSlug(id), data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    await Product.findOneAndDelete(byIdOrSlug(id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
