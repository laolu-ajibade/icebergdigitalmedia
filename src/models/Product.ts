import mongoose, { Schema, Document, Model } from "mongoose";

export interface QuantityTier {
  quantity: number;
  pricePerUnit: number; // in Naira ₦
  totalPrice: number;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  basePrice: number; // Starting price in ₦
  minQuantity: number;
  turnaroundDays: string;
  image: string;
  gallery: string[];
  paperStocks: string[];
  finishes: string[];
  quantityTiers: QuantityTier[];
  isPopular: boolean;
  isTopSelling: boolean;
  specifications: Record<string, string>;
}

const QuantityTierSchema = new Schema({
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categorySlug: { type: String, required: true },
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    minQuantity: { type: Number, default: 50 },
    turnaroundDays: { type: String, default: "24-48 Hours" },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    paperStocks: [{ type: String }],
    finishes: [{ type: String }],
    quantityTiers: [QuantityTierSchema],
    isPopular: { type: Boolean, default: false },
    isTopSelling: { type: Boolean, default: false },
    specifications: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
