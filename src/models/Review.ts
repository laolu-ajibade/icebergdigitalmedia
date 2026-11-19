import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  authorName: string;
  authorImage?: string;
  rating: number;
  reviewDate: string;
  text: string;
  photos?: string[];
  responseFromOwner?: string;
  responseDate?: string;
  isVerified: boolean;
  featured: boolean;
  order: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    authorName: { type: String, required: true },
    authorImage: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    reviewDate: { type: String, default: "Recently" },
    text: { type: String, required: true },
    photos: { type: [String], default: [] },
    responseFromOwner: { type: String, default: "" },
    responseDate: { type: String, default: "" },
    isVerified: { type: Boolean, default: true },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    source: { type: String, default: "google" },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
