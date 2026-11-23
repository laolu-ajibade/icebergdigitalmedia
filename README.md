# Iceberg Creative Print Studio

> **"Turning Ideas Into Impressions...."**  
> Commercial-grade digital printing press studio web application with an interactive public storefront, instant print cost estimator, slide-over cart, WhatsApp order dispatch, and a comprehensive authenticated Admin Control Center...

---

## 🚀 Quick Start

### 1. Installation
```bash
# Install dependencies
npm install
# or
pnpm install
# or
bun install
```

### 2. Run the Development Server
```bash
npm run dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🔐 Admin Dashboard & Login Credentials

The application includes an authenticated Admin Control Center at [`/admin`](http://localhost:3000/admin).

- **Admin URL:** `/admin/login`
- **Default Email:** `admin@icebergprints.com`
- **Default Password:** `admin123`
- **Session Auth:** Secure HTTP-only cookie with JWT verification.

### 🔑 Admin Password Change via API & Slug Key

The admin password can be updated directly from the **Admin > Settings** interface or remotely via API using the secret **Slug Key** defined in `.env.local` (`ADMIN_PASSWORD_SLUG_KEY`).

#### Environment Configuration (`.env.local`)
```env
ADMIN_PASSWORD_SLUG_KEY=iceberg-secure-slug-key-2026
```

#### Method 1: Dedicated Slug Route (POST)
```bash
curl -X POST http://localhost:3000/api/admin/auth/reset-password/iceberg-secure-slug-key-2026 \
  -H "Content-Type: application/json" \
  -d '{"newPassword": "yourNewStrongPassword"}'
```

#### Method 2: Change Password API (POST)
```bash
curl -X POST http://localhost:3000/api/admin/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "slugKey": "iceberg-secure-slug-key-2026",
    "newPassword": "yourNewStrongPassword"
  }'
```

#### Method 3: In the Admin Settings UI
Logged-in administrators can navigate to [`/admin/settings`](http://localhost:3000/admin/settings) to update their password using their current password or by providing the slug key.

### 🎨 Interactive Live Print Playground (Canva-Style Mockup Studio)

The website hero features a real-time 3D interactive print mockup studio allowing visitors to:
- Test their **Business Name** and **Tagline** in real-time.
- Switch between **Apparel (T-Shirts/Hoodies)**, **Mugs & Drinkware**, **Curved Gold-Foil Business Cards**, and **Magnetic Rigid Boxes**.
- Choose physical **Base Colors** and **Metallic/Print Foil Colors**.
- Optionally upload their own **Custom Logo Image** (PNG with transparency supported).
- Experience subtle 3D **Antigravity perspective tilt** as they move their cursor.
- Click **"Save Mockup (PNG)"** to immediately export a high-resolution client-side screenshot.
- Click **"Order on WhatsApp"** to launch a pre-populated chat with their custom specifications and starting run price.
- Click **"Add to Cart"** to add their bespoke mockup configuration directly to the slide-over cart.

---

### What Admins Can Manage:
1. **Overview Dashboard:** Monthly site visit counter (real-time monthly hits tracking), total products, categories, and WhatsApp orders.
2. **Product Catalog CRUD:** Add, edit, delete print products, configure base prices in Nigerian Naira (₦), and customize quantity discount tiers.
3. **Categories Manager:** Manage 10+ categories with icons, descriptions, and dropdown hierarchy.
4. **Blog Engine:** Author, edit, publish, or archive technical printing and branding articles.
5. **WhatsApp Orders Ledger:** Review customer orders routed to WhatsApp with itemized specs and customer contact details.
6. **Site Settings & Integrations:**
   - Lagos Studio Address, Phone, Email, and Working Hours.
   - Primary WhatsApp dispatch routing number (e.g., `+2349029480399`).
   - Social Media Links (Facebook, Instagram, X, LinkedIn, TikTok, YouTube).
   - Google Business Reviews configuration (`Google Place ID` & `Google API Key`).

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 15+ (App Router, Server Components & Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS Variable Semantic Tokens
- **Motion & Interaction:** Framer Motion + Antigravity Spatial Depth Principles
- **Database & Persistence:** MongoDB & Mongoose (compulsory `MONGODB_URI` defined in `.env.local`)
- **Icons:** Lucide React

---

## 🎨 Dual-Theme Design Engine

The application includes an instant theme switcher supporting two distinct design systems:
1. **Iceberg Brand Theme:** Deep Navy (`#0F172A`), Glacier Blue (`#0284C7`), Amber Gold (`#D97706`), Ice Mist canvas.
2. **Wise Canvas Theme:** Sage canvas (`#e8ebe6`), Deep Ink (`#0e0f0c`), Wise Lime (`#9fe870`), 24px pill radii as specified in `Design.md`.

Theme selection is persisted in `localStorage` without layout shifts or flashes.

---

## 🌟 Google Business Reviews Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com) and enable the **Places API (New)**.
2. Generate an **API Key**.
3. Obtain your **Google Place ID** via Google's [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
4. Enter both in **Admin > Settings**.
5. The public site automatically queries `/api/reviews` to display verified reviews, with built-in 5-star studio reviews and direct "Leave a Review on Google" links ready out-of-the-box.

---

## 🛡️ Strict Design Standards Enforced

- **Zero AI Slop:** No floating generic 3D objects, no generic gradients, no idle glassmorphism.
- **No `animate-pulse`:** All loading states use purposeful `animate-spin` spinners or clean static states.
- **No Idle Decorative Dots:** Zero ornamental indicator dots next to headers or labels.
- **Strict Prohibition on Badges:** Absolutely NO Pill Badges, Capsule Badges, or Eyebrow Badges anywhere in the application.
- **Prefers Reduced Motion:** Full compliance with accessibility standards.

---

## ✅ Post-Domain Launch TODO

Once the custom domain name is connected and `NEXT_PUBLIC_SITE_URL` is set in production:

- [x] **Google Search Console & Bing Webmaster Tools:**
  - Verify your live domain ownership.
  - Submit `${SITE_URL}/sitemap.xml`.
  - Run **URL Inspection** on `/`, `/categories`, `/blog`, and a `/product/[slug]` page to verify live crawl & indexing.
