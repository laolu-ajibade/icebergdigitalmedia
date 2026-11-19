import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitLog extends Document {
  monthKey: string; // e.g. "2026-11"
  hits: number;
  uniqueVisitors: number;
  lastVisited: Date;
}

const VisitLogSchema: Schema = new Schema(
  {
    monthKey: { type: String, required: true, unique: true },
    hits: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    lastVisited: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const VisitLog: Model<IVisitLog> =
  mongoose.models.VisitLog || mongoose.model<IVisitLog>("VisitLog", VisitLogSchema);
