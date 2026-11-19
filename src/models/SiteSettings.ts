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
  heroHeadline: string;
  heroSubtext: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  stats: Array<{ value: string; label: string }>;
  corporateHeadline: string;
  corporateSubtext: string;
  corporatePerks: string[];
  aboutHeadline: string;
  aboutStory: string;
  aboutChecks: string[];
  aboutImage: string;
  faqs: Array<{ question: string; answer: string }>;
  processSteps: Array<{ stepNumber: string; title: string; description: string }>;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    companyName: { type: String, default: "Iceberg Creative Print Studio" },
    tagline: { type: String, default: "Turning Ideas Into Impressions...." },
    address: {
      type: String,
      default: "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria",
    },
    phone: { type: String, default: "+234 802 309 3704" },
    whatsappRouting: { type: String, default: "+2348023093704" },
    email: { type: String, default: "hazkendigital@gmail.com" },
    workingHoursWeekday: { type: String, default: "09:00 - 18:00" },
    workingHoursSaturday: { type: String, default: "10:00 - 18:00" },
    workingHoursSunday: { type: String, default: "Closed" },
    facebookUrl: { type: String, default: "https://facebook.com/hazkendigital" },
    instagramUrl: { type: String, default: "https://instagram.com/hazkendigital" },
    twitterUrl: { type: String, default: "https://x.com/hazkendigital" },
    linkedinUrl: {
      type: String,
      default: "https://linkedin.com/company/hazkendigital",
    },
    youtubeUrl: { type: String, default: "https://youtube.com/@hazkendigital" },
    tiktokUrl: { type: String, default: "https://tiktok.com/@hazkendigital" },
    googlePlaceId: { type: String, default: "" },
    googleApiKey: { type: String, default: "" },
    deliveryPartners: {
      type: [String],
      default: ["Kwik Delivery", "Bolt Logistics", "GIG Logistics"],
    },
    heroHeadline: {
      type: String,
      default: "Commercial Precision Printing & Bespoke Packaging Atelier",
    },
    heroSubtext: {
      type: String,
      default:
        "High-definition digital press, bespoke rigid boxes, and luxury brand collateral produced in Shomolu, Lagos. Delivered nationwide across Nigeria.",
    },
    heroPrimaryCtaText: { type: String, default: "Explore Products" },
    heroPrimaryCtaLink: { type: String, default: "#top-selling" },
    heroSecondaryCtaText: { type: String, default: "Instant WhatsApp Quote" },
    heroSecondaryCtaLink: { type: String, default: "https://wa.me/2348023093704" },
    stats: {
      type: [{ value: { type: String }, label: { type: String } }],
      default: [],
    },
    corporateHeadline: {
      type: String,
      default: "Corporate Accounts & Enterprise Contract Printing",
    },
    corporateSubtext: {
      type: String,
      default:
        "From annual general meeting reports and luxury marketing kits to high-volume packaging rollouts, we provide priority production slots and dedicated account managers.",
    },
    corporatePerks: { type: [String], default: [] },
    aboutHeadline: {
      type: String,
      default: "The Craftsmanship Behind Iceberg Creative Print Studio",
    },
    aboutStory: { type: String, default: "" },
    aboutChecks: { type: [String], default: [] },
    aboutImage: {
      type: String,
      default:
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/boxes.jpg",
    },
    faqs: {
      type: [{ question: { type: String }, answer: { type: String } }],
      default: [],
    },
    processSteps: {
      type: [
        {
          stepNumber: { type: String },
          title: { type: String },
          description: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
