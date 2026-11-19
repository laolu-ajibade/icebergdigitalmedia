import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { Order } from "@/models/Order";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await ensureSeeded();
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    if (db) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return NextResponse.json({ orders });
    }

    return NextResponse.json({ orders: memoryStore.orders });
  } catch (error: any) {
    return NextResponse.json({ orders: memoryStore.orders, error: error.message });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const data = await request.json();

    if (!data.customerName || !data.customerPhone || !data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Name, phone, and items are required" }, { status: 400 });
    }

    const orderNumber = `ICE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderData = {
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress || "",
      items: data.items,
      totalAmount: data.totalAmount || 0,
      status: "Pending WhatsApp",
      notes: data.notes || "",
      createdAt: new Date(),
    };

    const db = await connectDB();
    let saved: any = newOrderData;
    if (db) {
      saved = await Order.create(newOrderData);
    }

    memoryStore.orders.unshift(saved);

    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
