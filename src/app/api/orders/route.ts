import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ orders: [], error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.customerName || !data.customerPhone || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "Name, phone, and items are required" },
        { status: 400 }
      );
    }

    const orderNumber = `ICE-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    await connectDB();
    const saved = await Order.create({
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress || "",
      items: data.items,
      totalAmount: data.totalAmount || 0,
      status: "Pending WhatsApp",
      notes: data.notes || "",
    });

    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
