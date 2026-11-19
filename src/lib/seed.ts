import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { Category } from "@/models/Category";
import { Tag } from "@/models/Tag";
import { Product } from "@/models/Product";
import { Blog } from "@/models/Blog";
import { Review } from "@/models/Review";
import { SiteSettings } from "@/models/SiteSettings";
import { VisitLog } from "@/models/VisitLog";
import { AdminUser } from "@/models/AdminUser";

export const initialTags = [
  { name: "Print", slug: "print", order: 1 },
  { name: "Design", slug: "design", order: 2 },
  { name: "Packaging", slug: "packaging", order: 3 },
  { name: "Apparel", slug: "apparel", order: 4 },
  { name: "Branding", slug: "branding", order: 5 },
];

export const initialCategories = [
  {
    name: "Packaging & Rigid Boxes",
    slug: "packaging-rigid-boxes",
    description:
      "Bespoke magnetic gift boxes, rigid product packaging, and courier mailers.",
    iconName: "Package",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/boxes.jpg",
    order: 1,
    featured: true,
    tags: ["Print", "Design", "Packaging"],
  },
  {
    name: "Custom Apparel & Clothes",
    slug: "custom-apparel-clothes",
    description:
      "Heavyweight hoodies, corporate polo shirts, screen-printed & embroidered streetwear.",
    iconName: "Shirt",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/clothes.jpg",
    order: 2,
    featured: true,
    tags: ["Print", "Design", "Apparel"],
  },
  {
    name: "Mugs & Drinkware",
    slug: "mugs-drinkware",
    description:
      "Full-color sublimation ceramic mugs, insulated tumblers, and corporate drinkware.",
    iconName: "Coffee",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/cups.jpg",
    order: 3,
    featured: true,
    tags: ["Print", "Drinkware"],
  },
  {
    name: "Corporate Gifts & Souvenirs",
    slug: "corporate-gifts-souvenirs",
    description:
      "Executive gift boxes, branded umbrellas, metallic pens, customized tech gift sets.",
    iconName: "Gift",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/boxes.jpg",
    order: 4,
    featured: true,
    tags: ["Print", "Design", "Gifts"],
  },
  {
    name: "Large Format & Rollup Banners",
    slug: "large-format-rollup-banners",
    description:
      "Retractable roll-up banners, backdrop stands, teardrop flags, vinyl vehicle branding.",
    iconName: "Flag",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/banner.jpg",
    order: 5,
    featured: true,
    tags: ["Print", "Signage"],
  },
  {
    name: "Executive Stationery",
    slug: "executive-stationery",
    description:
      "Curved-edge business cards, gold foil letterheads, embossed presentation folders.",
    iconName: "Briefcase",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg",
    order: 6,
    featured: true,
    tags: ["Print", "Design", "Stationery"],
  },
  {
    name: "Flyers & Marketing Collateral",
    slug: "flyers-marketing-collateral",
    description:
      "A4, A5, and DL commercial flyers, tri-fold brochures, sales brochures, magazines.",
    iconName: "FileText",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg",
    order: 7,
    featured: true,
    tags: ["Print", "Marketing"],
  },
  {
    name: "Stickers & Product Labels",
    slug: "stickers-product-labels",
    description:
      "Waterproof vinyl roll labels, die-cut custom stickers, foil seals, jar labels.",
    iconName: "Tag",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/cups.jpg",
    order: 8,
    featured: true,
    tags: ["Print", "Labels"],
  },
  {
    name: "Plastic ID Cards & Badges",
    slug: "plastic-id-cards-badges",
    description:
      "Smart RFID cards, frosted PVC employee badges, branded satin lanyards.",
    iconName: "CreditCard",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg",
    order: 9,
    featured: true,
    tags: ["Print", "ID Cards"],
  },
  {
    name: "Calendar & Paper Bags",
    slug: "calendar-paper-bags",
    description:
      "Desktop flip calendars, wall calendars, luxury matte laminated retail paper shopping bags.",
    iconName: "ShoppingBag",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/bags.jpg",
    order: 10,
    featured: true,
    tags: ["Print", "Packaging"],
  },
];

export const initialProducts = [
  {
    title: "Curved Edge Luxury Business Cards",
    slug: "curved-edge-luxury-business-cards",
    categorySlug: "executive-stationery",
    categoryName: "Executive Stationery",
    description:
      "Ultra-heavyweight 600gsm cotton board with radiused curved corners, hot-stamped gold foil typography, and soft-touch matte velvet lamination.",
    basePrice: 5000,
    minQuantity: 100,
    deliveryDays: "24-48 Hours",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg",
    gallery: ["https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg"],
    paperStocks: [
      "600gsm Cotton Cardstock",
      "350gsm Matte Artboard",
      "400gsm Pearl Metallic",
    ],
    finishes: [
      "Gold Foil Stamping + Soft Touch",
      "Spot UV Lamination",
      "Blind Debossing",
      "Plain Matte",
    ],
    quantityTiers: [
      { quantity: 100, pricePerUnit: 50, totalPrice: 5000 },
      { quantity: 250, pricePerUnit: 44, totalPrice: 11000 },
      { quantity: 500, pricePerUnit: 38, totalPrice: 19000 },
      { quantity: 1000, pricePerUnit: 32, totalPrice: 32000 },
    ],
    isPopular: true,
    isTopSelling: true,
    specifications: {
      Dimensions: "85mm x 55mm (Standard Euro/Nigeria)",
      Stock: "600gsm Uncoated / Coated Cotton Core",
      "Corner Radius": "6mm Precision Die-Cut",
      Coating: "Matte Anti-Scratch Velvet",
    },
  },
  {
    title: "Custom Heavyweight Branded Hoodie",
    slug: "custom-heavyweight-branded-hoodie",
    categorySlug: "custom-apparel-clothes",
    categoryName: "Custom Apparel & Clothes",
    description:
      "420gsm premium brushed fleece cotton hoodie with high-density screen printing or intricate direct-to-garment (DTG) embroidery. Preshrunk luxury fit.",
    basePrice: 18500,
    minQuantity: 5,
    deliveryDays: "3-4 Days",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/clothes.jpg",
    gallery: ["https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/clothes.jpg"],
    paperStocks: [
      "420gsm Brushed Fleece Cotton",
      "350gsm French Terry",
      "500gsm Heavyweight Luxury",
    ],
    finishes: [
      "Puff Print / 3D Screen Print",
      "Embroidery (10,000 stitches)",
      "Direct-to-Film (DTF) Vibrant",
    ],
    quantityTiers: [
      { quantity: 5, pricePerUnit: 18500, totalPrice: 92500 },
      { quantity: 20, pricePerUnit: 16500, totalPrice: 330000 },
      { quantity: 50, pricePerUnit: 14800, totalPrice: 740000 },
      { quantity: 100, pricePerUnit: 13200, totalPrice: 1320000 },
    ],
    isPopular: true,
    isTopSelling: true,
    specifications: {
      Material: "100% Organic Ring-Spun Cotton",
      Weight: "420 GSM",
      Fit: "Modern Relaxed / Boxy Cut",
      Colors: "Charcoal, Cream, Jet Black, Deep Navy",
    },
  },
  {
    title: "Two-Tone Ceramic Sublimation Mug",
    slug: "two-tone-ceramic-sublimation-mug",
    categorySlug: "mugs-drinkware",
    categoryName: "Mugs & Drinkware",
    description:
      "11oz premium grade AAA white ceramic mug with high-gloss polymer coating. Full wrap photographic print that resists fading, microwave and dishwasher safe.",
    basePrice: 3000,
    minQuantity: 12,
    deliveryDays: "24-48 Hours",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/cups.jpg",
    gallery: ["https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/cups.jpg"],
    paperStocks: [
      "Grade AAA Glazed Ceramic",
      "Matte Ceramic",
      "Stainless Insulated Tumbler",
    ],
    finishes: [
      "High Gloss Sublimation",
      "Matte Hydro-Dip",
      "Laser Engraved (Tumbler)",
    ],
    quantityTiers: [
      { quantity: 12, pricePerUnit: 3000, totalPrice: 36000 },
      { quantity: 50, pricePerUnit: 2600, totalPrice: 130000 },
      { quantity: 100, pricePerUnit: 2300, totalPrice: 230000 },
      { quantity: 500, pricePerUnit: 1950, totalPrice: 975000 },
    ],
    isPopular: true,
    isTopSelling: true,
    specifications: {
      Capacity: "11 oz / 330 ml",
      Printing: "300 DPI 8-Color Sublimation Transfer",
      Safety: "Lead & Cadmium Free, Dishwasher Safe",
    },
  },
  {
    title: "Luxury Magnetic Rigid Gift Box",
    slug: "luxury-magnetic-rigid-gift-box",
    categorySlug: "packaging-rigid-boxes",
    categoryName: "Packaging & Rigid Boxes",
    description:
      "1200gsm greyboard wrapped in specialty dyed paper with concealed magnetic flap closures. Precision custom EVA foam inlay option for luxury brand rollouts.",
    basePrice: 25000,
    minQuantity: 25,
    deliveryDays: "4-5 Days",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/boxes.jpg",
    gallery: ["https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/boxes.jpg"],
    paperStocks: [
      "1200gsm Heavy Greyboard",
      "1500gsm Extra Stiff Board",
      "Recycled Kraft Rigid",
    ],
    finishes: [
      "Gold Foil Hot Stamping",
      "Debossing + Spot UV",
      "Matte Soft-Touch Anti-Scratch",
    ],
    quantityTiers: [
      { quantity: 25, pricePerUnit: 25000, totalPrice: 625000 },
      { quantity: 50, pricePerUnit: 22000, totalPrice: 1100000 },
      { quantity: 100, pricePerUnit: 19500, totalPrice: 1950000 },
      { quantity: 250, pricePerUnit: 17000, totalPrice: 4250000 },
    ],
    isPopular: true,
    isTopSelling: true,
    specifications: {
      Construction: "Collapsible or Assembled Rigid Greyboard",
      Closure: "Concealed Neodymium Magnets",
      Lining: "Satin fabric or Laser-Cut EVA Foam",
    },
  },
  {
    title: "8-ft Retractable Roll-up Exhibition Banner",
    slug: "retractable-rollup-banner-8ft",
    categorySlug: "large-format-rollup-banners",
    categoryName: "Large Format & Rollup Banners",
    description:
      "Commercial heavy-duty aluminum teardrop base with high-definition anti-curl non-tear PET banner vinyl. Comes with padded Oxford canvas travel bag.",
    basePrice: 55000,
    minQuantity: 1,
    deliveryDays: "24 Hours",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/banner.jpg",
    gallery: ["https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/banner.jpg"],
    paperStocks: [
      "Anti-Curl Grey-Back PET Film",
      "Heavy 440gsm Vinyl Banner",
      "Fabric Dye-Sublimation",
    ],
    finishes: ["Matte Anti-Glare Coating", "Vivid Satin Lamination"],
    quantityTiers: [
      { quantity: 1, pricePerUnit: 55000, totalPrice: 55000 },
      { quantity: 3, pricePerUnit: 50000, totalPrice: 150000 },
      { quantity: 5, pricePerUnit: 46000, totalPrice: 230000 },
      { quantity: 10, pricePerUnit: 42000, totalPrice: 420000 },
    ],
    isPopular: true,
    isTopSelling: true,
    specifications: {
      Dimensions: "33 x 80 inches (85cm x 200cm)",
      Hardware: "Weighted Silver Aluminum Luxury Base",
      Resolution: "1440 DPI Eco-Solvent Commercial Print",
    },
  },
  {
    title: "A5 HD Double-Sided Full Color Flyers",
    slug: "a5-hd-double-sided-flyers",
    categorySlug: "flyers-marketing-collateral",
    categoryName: "Flyers & Marketing Collateral",
    description:
      "Crisp commercial marketing flyers printed on 170gsm silk art paper with true CMYK digital presses. Ideal for corporate activations, menus, and promotions.",
    basePrice: 16000,
    minQuantity: 200,
    deliveryDays: "24 Hours",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg",
    gallery: ["https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg"],
    paperStocks: [
      "170gsm Silk Art Paper",
      "250gsm Gloss Board",
      "300gsm Heavy Card",
    ],
    finishes: [
      "Double-Sided Gloss Lamination",
      "Double-Sided Matte Finish",
      "Machine Varnish",
    ],
    quantityTiers: [
      { quantity: 200, pricePerUnit: 80, totalPrice: 16000 },
      { quantity: 500, pricePerUnit: 60, totalPrice: 30000 },
      { quantity: 1000, pricePerUnit: 45, totalPrice: 45000 },
      { quantity: 2500, pricePerUnit: 35, totalPrice: 87500 },
    ],
    isPopular: true,
    isTopSelling: true,
    specifications: {
      Dimensions: "148mm x 210mm (Standard A5)",
      Stock: "170gsm FSC-Certified Silk",
      Print: "Full Color Process Double-Sided (4/4)",
    },
  },
  {
    title: "Luxury Debossed Paper Shopping Bags",
    slug: "luxury-debossed-paper-shopping-bags",
    categorySlug: "calendar-paper-bags",
    categoryName: "Calendar & Paper Bags",
    description:
      "250gsm reinforced art paper with debossed studio logos, matte film lamination, reinforced cardboard base, and thick braided cotton rope handles.",
    basePrice: 12500,
    minQuantity: 50,
    deliveryDays: "3-5 Days",
    image: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/bags.jpg",
    gallery: ["https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/bags.jpg"],
    paperStocks: [
      "250gsm Coated Art Paper",
      "200gsm Natural Kraft Paper",
      "Specialty Pearlized Paper",
    ],
    finishes: [
      "Matte Lamination + Debossing",
      "Gold Foil + Matte Black",
      "Spot UV Logo",
    ],
    quantityTiers: [
      { quantity: 50, pricePerUnit: 250, totalPrice: 12500 },
      { quantity: 100, pricePerUnit: 220, totalPrice: 22000 },
      { quantity: 250, pricePerUnit: 190, totalPrice: 47500 },
      { quantity: 500, pricePerUnit: 165, totalPrice: 82500 },
    ],
    isPopular: false,
    isTopSelling: false,
    specifications: {
      Size: "Medium: 32cm (H) x 25cm (W) x 10cm (Gusset)",
      Handles: "Thick Braided 100% Cotton with Eyelets",
      Base: "Reinforced 400gsm Bottom Stiffener",
    },
  },
];

export const initialBlogs = [
  {
    title:
      "The Ultimate Guide to Paper Weights (GSM) and Finishes: Matte, Gloss, and Soft-Touch Explained",
    slug: "guide-to-paper-weights-and-finishes",
    excerpt:
      "Navigating GSM ratings, tactile lamination choices, and coating techniques so your business stationery and marketing collateral convey true luxury in Lagos.",
    category: "Print Engineering",
    coverImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/business-cards.jpg",
    author: "Iceberg Master Printmakers",
    readTime: "6 min read",
    tags: ["Paper Stocks", "Finishes", "Business Cards", "Print Guide"],
    published: true,
    publishedAt: new Date(),
    content: `When a client holds your business card, presentation brochure, or proposal folder, the subconscious judgment of your brand happens in the fingertips before their eyes read a single line of text.

### Understanding GSM: The Foundation of Tactile Prestige
GSM stands for *Grams per Square Meter*. It is the international standard measuring paper density and weight:

- **80 – 100 GSM:** Standard office copy paper and internal letterheads.
- **130 – 170 GSM:** High-impact commercial flyers, marketing brochures, and posters. Offers vibrant color saturation without feeling flimsy.
- **250 – 300 GSM:** Presentation folder covers, invitations, and lightweight greeting cards.
- **350 – 600 GSM:** Executive commercial business cards and luxury stationery. At 600gsm cotton board, your card resists bends, feels architectural, and immediately conveys institutional weight.

### Choosing the Right Finish: Matte vs. Gloss vs. Soft-Touch

1. **Matte Lamination:** A glare-free, satin surface that diffuses light. Perfect for corporate brands, legal practices, and luxury goods where understated sophistication is desired.
2. **Gloss Lamination:** A glass-like high-shine coating that amplifies color saturation, making reds, blues, and blacks punch with intense depth. Ideal for product flyers and food menus.
3. **Soft-Touch Velvet Lamination:** A premium polyurethane film that feels like brushed peach skin or velvet suede. When paired with raised Spot UV or hot-stamped gold foil, the contrast between the velvety background and glossy raised foil creates an unforgettable tactile impression.

At **Iceberg Creative Print Studio**, our Shomolu press house uses calibrated high-definition digital presses and Italian die-cutting blades to ensure precision registration on every single sheet.`,
  },
  {
    title:
      "How Custom Rigid Packaging Transforms Brand Perception and Unboxing in Lagos",
    slug: "how-custom-rigid-packaging-transforms-brand-perception",
    excerpt:
      "Why leading Nigerian fashion houses, corporate gift curators, and tech founders are investing in magnetic rigid boxes to drive viral unboxing and customer retention.",
    category: "Bespoke Packaging",
    coverImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/boxes.jpg",
    author: "Iceberg Packaging",
    readTime: "5 min read",
    tags: ["Packaging", "Unboxing", "Branding", "Luxury Boxes"],
    published: true,
    publishedAt: new Date(Date.now() - 86400000 * 3),
    content: `In an era dominated by social commerce and influencer marketing across Lagos, Abuja, and Port Harcourt, packaging is no longer just a shipping container — it is your customer's first physical touchpoint with your brand.

### The Psychology of The Magnetic Snap
Have you ever wondered why opening an Apple product or a luxury watch feels so satisfying? It is the deliberate acoustic feedback of the magnetic snap. 

Our bespoke magnetic rigid boxes are engineered with 1200gsm high-density board wrapped in custom embossed paper stocks. When the lid drops, dual neodymium magnets pull together with a crisp, reassuring click. This sensory cue signals value, care, and craftsmanship before the product is even revealed.

### 3 Rules for Designing High-Converting Rigid Packaging

1. **Minimalist Exterior with High-Impact Foil:** Avoid cluttering the box lid. A clean logo rendered in micro-embossed metallic gold or champagne foil against a deep navy or chalk-white surface stands out dramatically on camera.
2. **Custom Die-Cut EVA Foam Inlays:** Protect fragile items (such as perfumery, ceramic mugs, or bespoke tech accessories) with laser-cut foam lined with velvet. This prevents movement in transit with Nigerian couriers like Kwik, Bolt, or GIG Logistics.
3. **The Surprise Interior:** Consider printing an inspirational quote, brand manifesto, or QR code inside the lid. This invites the recipient to scan, share on Instagram stories, or save the box for long-term desk storage.

Ready to engineer custom packaging that turns your customers into brand evangelists? Contact the Iceberg studio team today for a tailored 3D mockup and factory proof.`,
  },
];

export const initialReviews = [
  {
    authorName: "Oloyede Godliness",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/oloyede-godliness-avatar.png",
    rating: 5,
    reviewDate: "a week ago",
    text: "The trifold is such a business saver, save me a lot of explanation to customers on how to use our products. I shared my raw idea and design with Iceberg and it was redesigned and printed as such a beautiful trifold. You should get one for your business. Contact them today and you will not be disappointed.",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 1,
    source: "google",
  },
  {
    authorName: "Simi Agbana",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/simi-agbana-avatar.png",
    rating: 5,
    reviewDate: "a week ago",
    text: "I had an excellent experience with Iceberg Creative Print Studio! Their service was nothing short of exceptional timely, efficient, and delivered with impressive attention to detail. He was professional, responsive, and committed to delivering high quality print work.",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 2,
    source: "google",
  },
  {
    authorName: "Ada Amaka",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/ada-amaka-avatar.png",
    rating: 5,
    reviewDate: "3 weeks ago",
    text: "They did an amazing soul sanctifying job for me. This is my evidence as seen. I recommend them. And I rate them 1000 over 1000.",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 3,
    source: "google",
  },
  {
    authorName: "Rasheed Ishola",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/rasheed-ishola-avatar.png",
    rating: 5,
    reviewDate: "a month ago",
    text: "Excellent service! I'm really happy with the quality of my stickers. The design came out beautiful, and the service was fast and professional. I definitely recommend them. Thank you so much! 🙏",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 4,
    source: "google",
  },
  {
    authorName: "Tina Fingesi-Johnson",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/tina-fingesi-johnson-avatar.png",
    rating: 5,
    reviewDate: "2 months ago",
    text: "I've used Iceberg Digital Media for customized mugs, and I honestly couldn't have been more pleased with the outcome. I had several mugs made around 2021, and the quality was impressive!",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 5,
    source: "google",
  },
  {
    authorName: "Tofunmi Ariyo",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/tofunmi-ariyo-avatar.png",
    rating: 5,
    reviewDate: "2 months ago",
    text: "Excellent service from start to finish! The quality of their printing and branding is top-notch, and they delivered exactly what I needed. Professional, creative, and reliable. Highly recommended!",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 6,
    source: "google",
  },
  {
    authorName: "Oyibo Franca 17",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/oyibo-franca-17-avatar.png",
    rating: 5,
    reviewDate: "2 months ago",
    text: "Really happy with the design service. The process was smooth, communication was easy, and they actually took the time to understand what I was going for instead of just throwing something together. The final design came out really clean and honestly better than I expected.",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 7,
    source: "google",
  },
  {
    authorName: "Mezie Okeke",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/mezie-okeke-avatar.png",
    rating: 5,
    reviewDate: "a month ago",
    text: "Great brand with quality products and excellent customer service. Smooth experience from start to finish. Highly recommended!",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 8,
    source: "google",
  },
  {
    authorName: "Grace Leonard",
    authorImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/reviews/grace-leonard-avatar.png",
    rating: 5,
    reviewDate: "4 months ago",
    text: "The experience I had with this company was so amazing!!! Quality branded items and delivery was swift! Highly recommended!",
    photos: [],
    responseFromOwner: "",
    responseDate: "",
    isVerified: true,
    featured: true,
    order: 9,
    source: "google",
  },
];

export const initialSiteSettings = {
  companyName: "Iceberg Creative Print Studio",
  tagline: "Turning Ideas Into Impressions....",
  defaultTheme: "iceberg",
  topBarHoursText: "Mon - Sat: 09:00 - 18:00 (Shomolu, Lagos)",
  topBarTagline: "Commercial Grade Print Press & Packaging Studio",
  reviewsTrustedCount: "500+",
  reviewsOverallRating: 0,
  address: "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria",
  phone: "+234 802 309 3704",
  whatsappRouting: "+2348023093704",
  email: "digitalmedia@gmail.com",
  workingHoursWeekday: "09:00 - 18:00",
  workingHoursSaturday: "10:00 - 18:00",
  workingHoursSunday: "Closed",
  facebookUrl: "https://facebook.com/digitalmedia",
  instagramUrl: "https://instagram.com/digitalmedia",
  twitterUrl: "https://x.com/digitalmedia",
  linkedinUrl: "https://linkedin.com/company/digitalmedia",
  youtubeUrl: "https://youtube.com/@digitalmedia",
  tiktokUrl: "https://tiktok.com/@digitalmedia",
  googlePlaceId: "",
  googleApiKey: "",
  deliveryPartners: ["Kwik Delivery", "Bolt Logistics", "GIG Logistics"],
  heroHeadline: "Commercial Precision Printing & Bespoke Packaging",
  heroSubtext:
    "High-definition digital press, bespoke rigid boxes, and luxury brand collateral produced in Shomolu, Lagos. Delivered nationwide across Nigeria.",
  heroPrimaryCtaText: "Explore Products",
  heroPrimaryCtaLink: "#top-selling",
  heroSecondaryCtaText: "Instant WhatsApp Quote",
  heroSecondaryCtaLink: "https://wa.me/2348023093704",
  stats: [
    { value: "500K+", label: "Units Printed & Delivered" },
    { value: "99.4%", label: "On-Time Fulfillment Rate" },
    { value: "24-48h", label: "Express Delivery Available" },
    { value: "15+", label: "Years of Master Craftsmanship" },
  ],
  corporateHeadline: "Corporate Accounts & Enterprise Contract Printing",
  corporateSubtext:
    "From annual general meeting reports and luxury marketing kits to high-volume packaging rollouts, we provide priority production slots and dedicated account managers.",
  corporatePerks: [
    "Dedicated corporate press manager & press checks",
    "Bespoke volume tier discounts up to 35%",
    "Scheduled monthly & quarterly bulk fulfillment across Nigeria",
    "FSC-certified sustainable papers and European vegetable inks",
  ],
  aboutHeadline: "The Craftsmanship Behind Iceberg Creative Print Studio",
  aboutStory:
    "Rooted in the historic printmaking hub of Shomolu, Lagos, Iceberg Creative Print Studio blends time-tested mechanical craftsmanship with next-generation digital printing technologies. We believe your physical brand assets should feel as impressive in the hand as they look on the screen.",
  aboutChecks: [
    "State-of-the-art Japanese & German digital presses",
    "Real-time digital proofing before every run",
    "Strict CMYK color gamut calibration and delta-E controls",
    "Same-day Lagos dispatch via Bolt, Kwik, and GIG Logistics",
  ],
  aboutImage: "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg/images/products/boxes.jpg",
  faqs: [
    {
      question: "How fast can I get my print order delivered in Lagos?",
      answer:
        "Most standard digital print orders (business cards, flyers, roll-up banners, and stickers) are fulfilled within 24 to 48 hours. Bespoke rigid packaging and custom foil stamping orders take 3 to 5 business days depending on volume.",
    },
    {
      question: "Can I inspect physical proofs before full production?",
      answer:
        "Yes! For large volume orders or bespoke packaging, we can produce a digital press proof or physical mockup for your inspection and sign-off before mass printing.",
    },
    {
      question: "Do you deliver outside Lagos across Nigeria?",
      answer:
        "Absolutely. We partner with GIG Logistics, Kwik, and interstate courier services to deliver safely to Abuja, Port Harcourt, Ibadan, Kano, and all 36 states.",
    },
    {
      question: "What file formats do you accept for artwork?",
      answer:
        "We accept high-resolution PDF (print ready with 3mm bleed and CMYK color space), Adobe Illustrator (.AI), Photoshop (.PSD), and CorelDraw (.CDR). If you only have a draft idea, our in-house prepress design team can refine it.",
    },
    {
      question: "What is your minimum order quantity (MOQ)?",
      answer:
        "Our minimum order quantities vary by product: starting as low as 1 unit for roll-up banners, 5 units for custom hoodies, 12 units for mugs, 100 units for business cards, and 200 units for marketing flyers.",
    },
  ],
  processSteps: [
    {
      stepNumber: "01",
      title: "Select & Configure",
      description:
        "Choose your product, paper stock, finishing options, and quantity tier with instant price calculation.",
    },
    {
      stepNumber: "02",
      title: "Review Digital Proof",
      description:
        "Upload your print ready artwork or let our studio design team format it with full bleed and CMYK checks.",
    },
    {
      stepNumber: "03",
      title: "Press & Delivery",
      description:
        "Your order is precision printed in Shomolu and dispatched across Lagos and nationwide within 24-48 hours.",
    },
  ],
  studioItems: [
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
};

/**
 * Explicit Seeder Function — run ONLY via CLI seeder script (`npm run seed`).
 */
export async function seedDatabase() {
  await connectDB();
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  if ((await Tag.countDocuments()) === 0) {
    await Tag.insertMany(initialTags);
  }

  if ((await Category.countDocuments()) === 0) {
    await Category.insertMany(initialCategories);
  }
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(initialProducts);
  }
  if ((await Blog.countDocuments()) === 0) {
    await Blog.insertMany(initialBlogs);
  }
  if ((await Review.countDocuments()) === 0) {
    await Review.insertMany(initialReviews);
  }
  if ((await SiteSettings.countDocuments()) === 0) {
    await SiteSettings.create(initialSiteSettings);
  }
  if (!(await VisitLog.findOne({ monthKey: currentMonthKey }))) {
    await VisitLog.create({
      monthKey: currentMonthKey,
      hits: 1480,
      uniqueVisitors: 920,
      lastVisited: new Date(),
    });
  }
  if ((await AdminUser.countDocuments()) === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await AdminUser.create({
      email: "admin@icebergprints.com",
      passwordHash,
      role: "Super Admin",
    });
  }
}
