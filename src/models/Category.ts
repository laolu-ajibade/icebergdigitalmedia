import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  order: number;
  featured: boolean;
  tags: string[];
  itemCount?: number;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    iconName: { type: String, default: "Box" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
    tags: {
      type: [String],
      default: ["Print"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length <= 5,
        message: "A category cannot have more than 5 tags.",
      },
    },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
