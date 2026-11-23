import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  companyName: string;
  tagline: string;
  footerSummary: string;
  footerDescription: string;
  footerMotto: string;
  defaultTheme: "wise" | "iceberg" | "brand" | "editorial";
  topBarHoursText: string;
  topBarTagline: string;
  reviewsTrustedCount: string;
  reviewsOverallRating: number;
  address: string;
  address2: string;
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
  heroImage: string;
  heroImageFocusDesktop: string;
  heroImageFocusMobile: string;
  servicesIntroLabel: string;
  servicesIntroHeadline: string;
  servicesIntroSubtext: string;
  servicesIntroLink: string;
  servicesCards: Array<{
    iconName: string;
    title: string;
    description: string;
    isDark?: boolean;
    href?: string;
  }>;
  collageStatTitle: string;
  collageStatSubtext: string;
  collageImages: string[];
  inquiryHeadline: string;
  inquirySubtext: string;
  portfolioHeadline: string;
  portfolioSubtext: string;
  portfolioPageHeadline: string;
  portfolioPageSubtext: string;
  portfolioProjectTitle: string;
  portfolioProjectDesc: string;
  portfolioProjectChecks: string[];
  portfolioSolutionTitle: string;
  portfolioSolutionDesc: string;
  portfolioSolutionChecks: string[];
  portfolioImages: string[];
  aboutFounderName: string;
  aboutFounderBio: string;
  aboutSkills: Array<{ label: string; percentage: number }>;
  contactHeadline: string;
  contactSubtext: string;
  contactFormHeadline: string;
  contactFormSubtext: string;
  stats: Array<{ value: string; label: string }>;
  corporateHeadline: string;
  corporateSubtext: string;
  corporatePerks: string[];
  aboutHeadline: string;
  aboutStory: string;
  aboutChecks: string[];
  aboutImage: string;
  teamImage: string;
  teamPillars: Array<{ title: string; description: string }>;
  teamCtaText: string;
  clientBrands: string[];
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
      enum: ["wise", "iceberg", "brand", "editorial"],
      default: "brand",
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
      default: "Somolu, Lagos",
    },
    address2: {
      type: String,
      default: "14/17 Lateef Eletu Street, Awoyaya, Lagos",
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
        "All Types of Printing | Corporate Branding | Custom Packaging | Signage | Promotional Products | Large-Scale Branding & Production.",
    },
    heroPrimaryCtaText: { type: String, default: "Explore Products" },
    heroPrimaryCtaLink: { type: String, default: "/products" },
    heroImage: {
      type: String,
      default:
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/hero/reel-packaging.jpg",
    },
    heroImageFocusDesktop: {
      type: String,
      default: "50% 50%",
    },
    heroImageFocusMobile: {
      type: String,
      default: "50% 50%",
    },
    servicesIntroLabel: {
      type: String,
      default: "Our services",
    },
    servicesIntroHeadline: {
      type: String,
      default:
        "Brand Identity, Graphic Design, Digital Printing & Bespoke Packaging.",
    },
    servicesIntroSubtext: {
      type: String,
      default:
        "We combine precision commercial press engineering with studio-grade design direction for brands across Nigeria.",
    },
    servicesIntroLink: {
      type: String,
      default: "/categories",
    },
    servicesCards: {
      type: [
        {
          iconName: { type: String },
          title: { type: String },
          description: { type: String },
          isDark: { type: Boolean, default: false },
          href: { type: String, default: "/categories" },
        },
      ],
      default: [
        {
          iconName: "Printer",
          title: "Digital & Offset Printing",
          description:
            "Calibrated CMYK commercial press runs for 600gsm cotton cards, brochures, and executive stationery.",
          isDark: false,
          href: "/categories",
        },
        {
          iconName: "Package",
          title: "Bespoke Rigid Packaging",
          description:
            "Custom die-cut boxes, magnetic gift packaging, and soft-touch matte lamination with hot-foil.",
          isDark: true,
          href: "/category/packaging-boxes",
        },
        {
          iconName: "Palette",
          title: "Brand Identity & Design",
          description:
            "Complete visual identity systems, print-ready artwork calibration, and corporate brand guidelines.",
          isDark: false,
          href: "/categories",
        },
        {
          iconName: "Shirt",
          title: "Apparel & Merch",
          description:
            "420gsm brushed fleece hoodies, screen-printed tees, embroidered caps, and glazed ceramic mugs.",
          isDark: false,
          href: "/category/branded-apparel",
        },
        {
          iconName: "Flag",
          title: "Signage & Exhibitions",
          description:
            "Wide-format roll-up banners, acrylic lightboxes, vehicle branding, and event backdrops.",
          isDark: false,
          href: "/categories",
        },
      ],
    },
    collageStatTitle: {
      type: String,
      default: "We Complete More Than 1,000+ Print Runs Every Year",
    },
    collageStatSubtext: {
      type: String,
      default: "Shomolu central press serving brands across 36 states.",
    },
    collageImages: {
      type: [String],
      default: [
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/hero/reel-apparel.jpg",
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/hero/reel-cards.jpg",
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/hero/reel-stationery.jpg",
      ],
    },
    inquiryHeadline: {
      type: String,
      default: "For Your Print Quotes & Studio Updates",
    },
    inquirySubtext: {
      type: String,
      default:
        "Drop your email or project brief to receive our corporate rate card, sample kit availability, and instant press desk response.",
    },
    portfolioHeadline: {
      type: String,
      default: "Our Portfolio, Quality Results",
    },
    portfolioSubtext: {
      type: String,
      default:
        "Explore commercial print runs, rigid packaging, and branded collateral produced in our Shomolu studio.",
    },
    portfolioPageHeadline: {
      type: String,
      default: "Creativity as it speaks excellence!",
    },
    portfolioPageSubtext: {
      type: String,
      default:
        "We transform your perception into remarkable Creative Branding, Graphic Design, Packaging, and Commercial Digital Printing.",
    },
    portfolioProjectTitle: {
      type: String,
      default: "Start a new project with us and build something iconic together!",
    },
    portfolioProjectDesc: {
      type: String,
      default:
        "Digital Printing Press, Bespoke Packaging, Creative Branding, and Brand Identity in Shomolu, Lagos Nigeria.",
    },
    portfolioProjectChecks: {
      type: [String],
      default: [
        "Bespoke Rigid Packaging",
        "600gsm Foil Business Cards",
        "Brand Identity & Guidelines",
        "Commercial Digital Printing",
      ],
    },
    portfolioSolutionTitle: {
      type: String,
      default: "Our Solution",
    },
    portfolioSolutionDesc: {
      type: String,
      default:
        "We craft tactile brand collateral, commercial packaging, and studio-grade print systems that command attention.",
    },
    portfolioSolutionChecks: {
      type: [String],
      default: [
        "Proven results & calibrated CMYK print precision",
        "Deep expertise in paper stocks, foil & finishing",
        "Dedicated creative direction & pre-press proofing",
        "Same-day Lagos dispatch & 36-state delivery",
      ],
    },
    portfolioImages: {
      type: [String],
      default: [
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/stationery-set.jpg",
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/custom-packaging.jpg",
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/cups.jpg",
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/clothes.jpg",
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/stickers-labels.jpg",
      ],
    },
    aboutFounderName: {
      type: String,
      default: "Iceberg Creative Print Studio",
    },
    aboutFounderBio: {
      type: String,
      default:
        "Founded in Shomolu, Lagos — blending mechanical press craftsmanship with modern design direction.",
    },
    aboutSkills: {
      type: [{ label: { type: String }, percentage: { type: Number } }],
      default: [
        { label: "Commercial Digital & Offset Printing", percentage: 96 },
        { label: "Bespoke Rigid Packaging & Foil", percentage: 94 },
        { label: "Brand Identity & Graphic Design", percentage: 92 },
        { label: "Heavyweight Apparel & Merch", percentage: 95 },
      ],
    },
    contactHeadline: {
      type: String,
      default: "We're Here to Help.",
    },
    contactSubtext: {
      type: String,
      default:
        "We always want to hear from you! Let us know how we can help with your next print run or brand rollout.",
    },
    contactFormHeadline: {
      type: String,
      default: "Have a project? Let's make something great together!",
    },
    contactFormSubtext: {
      type: String,
      default:
        "Get in touch with our Shomolu production desk to see how we can bring your print project to life.",
    },
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
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/founder-portrait.jpg",
    },
    teamImage: {
      type: String,
      default:
        "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/team-studio.jpg",
    },
    teamPillars: {
      type: [{ title: { type: String }, description: { type: String } }],
      default: [
        {
          title: "Our Mission",
          description:
            "Deliver innovative designs and quality print solutions that help your brand stand out.",
        },
        {
          title: "Fast Support",
          description:
            "Quick help with your artwork, paper choices, and order updates.",
        },
        {
          title: "Client Satisfaction",
          description:
            "Clean, reliable prints for your business, brand, or upcoming event.",
        },
      ],
    },
    teamCtaText: {
      type: String,
      default: "View other feature",
    },
    clientBrands: {
      type: [String],
      default: [],
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
