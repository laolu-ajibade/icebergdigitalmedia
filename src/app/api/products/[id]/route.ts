import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { Product } from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectDB();
    if (db) {
      const product = await Product.findOne({ $or: [{ _id: id }, { slug: id }] });
      if (product) return NextResponse.json({ product });
    }

    const item = memoryStore.products.find((p) => p.slug === id || p._id === id);
    if (!item) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: item });
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
    const data = await request.json();

    const db = await connectDB();
    if (db) {
      const updated = await Product.findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }] },
        data,
        { new: true }
      );
      if (updated) return NextResponse.json({ product: updated });
    }

    const index = memoryStore.products.findIndex((p) => p.slug === id || p._id === id);
    if (index >= 0) {
      memoryStore.products[index] = { ...memoryStore.products[index], ...data };
      return NextResponse.json({ product: memoryStore.products[index] });
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await connectDB();
    if (db) {
      await Product.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    }

    memoryStore.products = memoryStore.products.filter((p) => p.slug !== id && p._id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
