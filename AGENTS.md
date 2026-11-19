# AGENTS.md — Development Guidelines & Rules for Iceberg Web

This document outlines the strict engineering rules, architecture conventions, and UI design standards that any AI agent or developer MUST adhere to when contributing to the **Iceberg Creative Print Studio** codebase.

---

## 1. Project Directory Structure

```
iceberg-web/
├── public/                     # Static assets (logos, favicons, AI-generated print images)
│   ├── favicon.ico
│   ├── logo.png                # Iceberg Studio brand logo
│   ├── logo-icon.png           # Iceberg atom icon
│   └── images/
│       ├── products/           # Generated product mockups (clothes, mugs, boxes, etc.)
│       └── logistics/          # Kwik, Bolt, GIG Logistics vector marks
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with ThemeProvider and visit tracking
│   │   ├── page.tsx            # High-impact Commercial Print Studio landing page
│   │   ├── categories/         # Master categories directory (/categories)
│   │   │   └── page.tsx
│   │   ├── category/           # Dedicated category pages (/category/[slug])
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/               # Public blog listing & post reader (/blog, /blog/[slug])
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── admin/              # Authenticated Admin Control Center
│   │   │   ├── layout.tsx      # Protected admin shell & navigation
│   │   │   ├── login/page.tsx  # Admin login
│   │   │   ├── page.tsx        # Overview & monthly site visit analytics
│   │   │   ├── products/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── blogs/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/                # Route handlers
│   │       ├── products/route.ts
│   │       ├── categories/route.ts
│   │       ├── blogs/route.ts
│   │       ├── orders/route.ts
│   │       ├── settings/route.ts
│   │       ├── reviews/route.ts
│   │       ├── analytics/visits/route.ts
│   │       ├── admin/auth/route.ts
│   │       ├── admin/auth/change-password/route.ts
│   │       └── admin/auth/reset-password/[slugKey]/route.ts
│   ├── components/
│   │   ├── layout/             # Navbar (10+ dropdown), Footer (Haz-Ken Lagos style)
│   │   ├── home/               # Hero + LivePrintCanvas + Estimator, TopSelling, Categories, HowWorks, Reviews, Stats, Faq
│   │   ├── cart/               # Slide-over cart & WhatsApp generator
│   │   ├── ui/                 # Purposeful buttons, inputs, modals, spinners
│   │   └── admin/              # Admin forms, tables, metric cards
│   ├── context/                # ThemeContext & CartContext
│   ├── lib/                    # MongoDB connection & hybrid in-memory fallback store, seed data
│   ├── models/                 # Mongoose schemas (Product, Category, Blog, Order, Setting, Visit)
│   └── styles/
│       └── globals.css         # Semantic CSS variables for dual themes & Antigravity tokens
├── README.md                   # Setup guide and Admin credentials
├── Design.md                   # Wise canvas specifications
├── AGENTS.md                   # This rules and architecture document
├── tailwind.config.ts          # Semantic Tailwind mapping
└── tsconfig.json
```

---

## 2. Strict UI & Design Constraints (Zero Tolerance)

Every developer and agent must strictly respect the following rules:

### A. Zero AI Slop
- **NO generic gradient blobs:** Avoid diffuse background blobs with no purpose.
- **NO floating 3D spheres / rings:** Only display actual commercial print products (mugs, apparel, business cards, boxes, rollups).
- **NO default templates:** Every section must feel deliberately designed for a high-end Lagos print press studio.

### B. No `animate-pulse` Policy
- **NEVER use `animate-pulse`** on UI elements, loading cards, buttons, or badges.
- For active loading or processing states, use purposeful spinners (`animate-spin`) or clean static states.

### C. No Idle Decorative Indicator Dots
- **Completely eliminate meaningless decorative indicator dots** (e.g., `<span className="w-2 h-2 rounded-full bg-accent" />` doing nothing next to header labels or card titles).
- Rely on clean, readable typography and intentional iconography rather than idle colored dots.

### D. Strict Prohibition on Badges
- **NO Badge (specifically a Pill Badge or Capsule Badge) or Eyebrow Badge (or Hero Pill Badge / Kicker Badge above headings)** are to be included anywhere in the application UNLESS specifically and explicitly instructed.

### E. Theme Switcher & Token Abstraction
- The frontend must be designed such that it is easy to switch design systems.
- Use CSS variable tokens (`var(--canvas)`, `var(--ink)`, `var(--primary)`, `var(--card)`, `var(--radius)`).
- Never hardcode hex values directly into component classes when a theme variable exists.

---

## 3. Antigravity UI & Motion Standards

Leverage the `antigravity-design-expert` principles:

1. **Weightlessness & Spatial Elevation:**
   - Use layered, soft, diffused drop shadows (`box-shadow: 0 20px 40px rgba(0,0,0,0.06)`).
   - Cards float gently on hover with subtle CSS transform lifts (`translateY(-4px)`).
2. **Staggered Entrances:**
   - When card grids load, stagger their entrance animations (e.g. `0.08s - 0.1s` per item) rather than all snapping in at once.
3. **Purposeful Micro-Interactions:**
   - Instant Estimator updates dynamically without jarring jumps.
   - Slide-over cart uses smooth cubic bezier springs.
4. **Accessibility First:**
   - Always wrap motion in `motion-reduce:transform-none` or Framer Motion `prefers-reduced-motion` checks.

---

## 4. Persistence & Database Strategy

- The project uses **MongoDB Persistence**:
  - `MONGODB_URI` is **compulsory** and must be defined in `.env.local` (e.g. `MONGODB_URI=mongodb://localhost:27017/iceberg_print_studio`).
  - Seed script runs automatically on boot to ensure at least 10 categories, top-selling products, 2 blog posts, default Haz-Ken studio settings, and the default admin account exist immediately upon first launch.
