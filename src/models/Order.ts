import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  title: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paperStock?: string;
  finish?: string;
  customNotes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "Pending WhatsApp" | "Confirmed" | "In Production" | "Dispatched" | "Delivered";
  notes?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paperStock: { type: String },
  finish: { type: String },
  customNotes: { type: String },
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, default: "" },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending WhatsApp", "Confirmed", "In Production", "Dispatched", "Delivered"],
      default: "Pending WhatsApp",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
