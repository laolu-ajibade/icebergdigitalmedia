import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  companyName: string;
  tagline: string;
  footerSummary: string;
  footerDescription: string;
  footerMotto: string;
  defaultTheme: "wise" | "iceberg" | "brand";
  topBarHoursText: string;
  topBarTagline: string;
  reviewsTrustedCount: string;
  reviewsOverallRating: number;
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
  processSteps: Array<{
    stepNumber: string;
    title: string;
    description: string;
  }>;
  studioItems: Array<{
    id: string;
    label: string;
    price: number;
    minQty: number;
    stockDesc: string;
    productSlug: string;
  }>;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    companyName: { type: String, default: "Iceberg Creative Print Studio" },
    tagline: { type: String, default: "Turning Ideas Into Impressions...." },
    footerSummary: {
      type: String,
      default:
        "Brand Identity, Graphic Design and Digital Printing Service.",
    },
    footerDescription: {
      type: String,
      default:
        "Full Responsive Websites and Application, Creative Branding, Graphic Design for Business Advertisement and High-quality Printing.",
    },
    footerMotto: {
      type: String,
      default: "Creativity as it speaks excellence!",
    },
    defaultTheme: {
      type: String,
      enum: ["wise", "iceberg", "brand"],
      default: "iceberg",
    },
    topBarHoursText: {
      type: String,
      default: "Mon - Sat: 09:00 - 18:00 (Shomolu, Lagos)",
    },
    topBarTagline: {
      type: String,
      default: "Commercial Grade Print Press & Packaging Studio",
    },
    reviewsTrustedCount: { type: String, default: "500+" },
    reviewsOverallRating: { type: Number, default: 0 },
    address: {
      type: String,
      default: "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria",
    },
    phone: { type: String, default: "+234 802 309 3704" },
    whatsappRouting: { type: String, default: "+2348023093704" },
    email: { type: String, default: "digitalmedia@gmail.com" },
    workingHoursWeekday: { type: String, default: "09:00 - 18:00" },
    workingHoursSaturday: { type: String, default: "10:00 - 18:00" },
    workingHoursSunday: { type: String, default: "Closed" },
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    googlePlaceId: { type: String, default: "" },
    googleApiKey: { type: String, default: "" },
    deliveryPartners: {
      type: [String],
      default: ["Kwik Delivery", "Bolt Logistics", "GIG Logistics"],
    },
    heroHeadline: {
      type: String,
      default: "Print That Commands Attention.",
    },
    heroSubtext: {
      type: String,
      default:
        "Custom rigid boxes, 600gsm foil cards, and heavyweight apparel—crafted in Lagos for brands that refuse to look ordinary.",
    },
    heroPrimaryCtaText: { type: String, default: "Explore Products" },
    heroPrimaryCtaLink: { type: String, default: "#top-selling" },
    marqueeItems: {
      type: [String],
      default: [
        "600GSM COTTON BOARDS",
        "METALLIC FOIL STAMPING",
        "BESPOKE RIGID PACKAGING",
        "CALIBRATED CMYK PRESS",
        "DIRECT-TO-GARMENT FLEECE",
        "24–48HR LAGOS DISPATCH",
        "36 STATES DELIVERY",
        "SHOMOLU ATELIER",
      ],
    },
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
    studioItems: {
      type: [
        {
          id: { type: String },
          label: { type: String },
          price: { type: Number },
          minQty: { type: Number },
          stockDesc: { type: String },
          productSlug: { type: String },
        },
      ],
      default: [
        {
          id: "tshirt",
          label: "Apparel",
          price: 18500,
          minQty: 5,
          stockDesc: "420gsm Brushed Fleece Cotton",
          productSlug: "custom-heavyweight-branded-hoodie",
        },
        {
          id: "mug",
          label: "Drinkware",
          price: 3000,
          minQty: 12,
          stockDesc: "Grade AAA Glazed Ceramic",
          productSlug: "two-tone-ceramic-sublimation-mug",
        },
        {
          id: "card",
          label: "Business Card",
          price: 5000,
          minQty: 100,
          stockDesc: "600gsm Cotton Foil Board",
          productSlug: "curved-edge-luxury-business-cards",
        },
        {
          id: "jotter",
          label: "Jotters",
          price: 15000,
          minQty: 50,
          stockDesc: "A5 Hardcover Spiral Note Jotter",
          productSlug: "custom-hardcover-spiral-note-jotter",
        },
      ],
    },
  },
  { timestamps: true },
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
