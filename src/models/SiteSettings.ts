import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsappRouting: string;
  email: string;
  workingHoursWeekday: string;
  workingHoursSaturday: string;
  workingHoursSunday: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  googlePlaceId: string;
  googleApiKey: string;
  deliveryPartners: string[];
}

const SiteSettingsSchema: Schema = new Schema(
  {
    companyName: { type: String, default: "Iceberg Creative Print Studio" },
    tagline: { type: String, default: "Turning Ideas Into Impressions...." },
    address: { type: String, default: "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria" },
    phone: { type: String, default: "+234 902 948 0399" },
    whatsappRouting: { type: String, default: "+2349029480399" },
    email: { type: String, default: "hazkendigital@gmail.com" },
    workingHoursWeekday: { type: String, default: "09:00 - 18:00" },
    workingHoursSaturday: { type: String, default: "10:00 - 18:00" },
    workingHoursSunday: { type: String, default: "Closed" },
    facebookUrl: { type: String, default: "https://facebook.com/hazkendigital" },
    instagramUrl: { type: String, default: "https://instagram.com/hazkendigital" },
    twitterUrl: { type: String, default: "https://x.com/hazkendigital" },
    linkedinUrl: { type: String, default: "https://linkedin.com/company/hazkendigital" },
    youtubeUrl: { type: String, default: "https://youtube.com/@hazkendigital" },
    tiktokUrl: { type: String, default: "https://tiktok.com/@hazkendigital" },
    googlePlaceId: { type: String, default: "" },
    googleApiKey: { type: String, default: "" },
    deliveryPartners: {
      type: [String],
      default: ["Kwik Delivery", "Bolt Logistics", "GIG Logistics"],
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
