import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITag extends Document {
  name: string;
  slug: string;
  order: number;
}

const TagSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
