# Design.md — Iceberg Creative Print Studio Design System

This document is the authoritative design system and multi-theme specification for **Iceberg Creative Print Studio** (`iceberg-web`). Every UI update MUST respect all four themes below and rely exclusively on CSS variable tokens so theme switching in `/admin/settings` works seamlessly without breaking contrast or layout.

---

## 1. Global Typography (All Themes)

All themes share a unified, high-clarity typographic system loaded via `next/font/google` in `src/app/layout.tsx`:

1. **Primary Display Face — `Montserrat`** (`--font-display`, weights `500, 600, 700, 800`):
   - Used for `h1`–`h4` headings, section titles, `.font-display`, and primary buttons.
   - Letter spacing: `-0.02em`.
   - **Rule:** Use sentence case for headings; reserve uppercase for short navigation labels, buttons, and technical tags.
2. **Supporting Body Face — `Inter`** (`--font-sans`, weights `400, 500, 600, 700`):
   - Used for all body copy, product descriptions, forms, and captions.
3. **Technical Mono Face — `JetBrains Mono`** (`--font-mono`, weights `400, 500, 600`):
   - Used for tabular prices, GSM/dimension specs, turnaround badges, and step numbers.

---

## 2. Switchable Theme Tokens (`src/styles/globals.css`)

Never hardcode hex colors or fixed pixel radii in components when a semantic token exists (`bg-canvas`, `bg-canvas-soft`, `bg-card`, `text-ink`, `text-ink-body`, `text-ink-muted`, `bg-primary`, `text-primary-foreground`, `border-border`, `rounded-card`, `rounded-button`, `rounded-theme`).

### A. `editorial` — Editorial Studio (Default)
- **Primary:** `#b91c1c` (Hover `#991b1b`, Active `#7f1d1d`, Pale `#fef2f2`)
- **Secondary / Ink:** `#111215` (Body `#3f3f46`, Muted `#71717a`)
- **Canvas:** `#ffffff` (Soft `#f7f7f8`, Muted `#efefef`, Border `#e4e4e7`)
- **Radii:** `--radius: 8px`, `--radius-card: 10px`, `--radius-button: 6px`
- **Character:** Crisp white editorial canvas with obsidian structural blocks, crimson CTAs, and sharper architectural corners.

### B. `brand` — Iceberg Brand Manual (Deep Blue, Cyan & Gold)
Strictly follows the **Iceberg Brand Guidelines** (12-page master manual):
- **Recommended Colour Balance:** White `48%` (dominant canvas) · Deep Blue `24%` (headings, structure, dark blocks) · Light Blue `16%` (soft highlight panels) · Logo Cyan `8%` (buttons, links, icons) · Logo Gold (fine rules & small accents only).
- **Palette:**
  - `--primary` (Logo Cyan): `#0AA3D3` (Hover `#088BB5`, Active `#067093`, Pale `#EAF2FB`)
  - `--secondary` / `--ink` (Deep Blue): `#123B72` (Deep `#0B2549`)
  - `--accent` (Logo Gold): `#C2A121`
  - `--ink-body` (Charcoal): `#26323A` (Muted `#526370`)
  - `--canvas`: `#FFFFFF` · `--canvas-soft` (Cool Grey): `#F4F7F9` · `--canvas-muted` (Light Blue): `#EAF2FB`
  - `--border`: `#D5E3F3`
- **Radii:** `--radius: 14px`, `--radius-card: 16px`, `--radius-button: 9999px` (pill-shaped CTAs).
- **Typography:** `Montserrat` headings & buttons, `Inter` body copy.

### C. `iceberg` — Iceberg Studio Classic (Deep Navy & Cyan)
- **Primary:** `#0284c7` (Hover `#0369a1`, Active `#0c4a6e`, Pale `#e0f2fe`)
- **Secondary:** `#d97706` · **Accent:** `#1e293b`
- **Canvas:** `#ffffff` (Soft `#f8fafc`, Muted `#f1f5f9`, Border `#e2e8f0`)
- **Ink:** `#0f172a` (Deep `#020617`, Body `#334155`, Muted `#64748b`)
- **Radii:** `--radius: 16px`, `--radius-card: 18px`, `--radius-button: 12px`

### D. `wise` — Wise Canvas (Editorial Light & Lime)
- **Primary:** `#9fe870` (Hover `#cdffad`, Active `#c5edab`, Pale `#e2f6d5`, Foreground `#0e0f0c`)
- **Secondary:** `#163300` · **Accent:** `#38c8ff`
- **Canvas:** `#ffffff` (Soft `#e8ebe6`, Muted `#dbe0d7`, Border `#0e0f0c`)
- **Ink:** `#0e0f0c` (Deep `#163300`, Body `#454745`, Muted `#5f615e`)
- **Radii:** `--radius: 24px`, `--radius-card: 24px`, `--radius-button: 24px`

---

## 3. Logo, Imagery & Voice Rules

### Logo Usage
- Always use the approved logo files (`/logo.png?v=2` for horizontal lockups, `/logo-icon.png?v=2` for favicons and square marks).
- Keep proportions intact (`object-contain`); never stretch, distort, recolor, add drop shadows, or retype the wordmark in another font.
- On dark backgrounds (e.g., the dark footer), place the full-color logo inside a clean white container (`bg-white rounded-theme px-3 py-1.5`) with clear space.

### Imagery & Cloudflare R2 Policy
- All product, hero, team, founder, and portfolio images MUST be hosted on Cloudflare R2 (`https://...`) rather than local `/images/...` paths (only `favicon.ico`, `logo.png`, and `logo-icon.png`/`logo-icon.jpg` remain local).
- Keep product card image containers uniform (`h-48` in directory grids, `h-64` in portfolio/product showcases).

### Voice & Messaging
- Tone: Clear, confident, approachable, and customer-focused.
- **Avoid:** Hype claims (`"Number one"`, `"Cheapest"`, `"Best in Nigeria"`), excessive exclamation marks (`!!!`), vague promises, or unexplained technical jargon.

---

## 4. Layout, Motion & Accessibility Guardrails

- **Antigravity Elevation:** Use `.antigravity-card` (`translateY(-5px)` lift and diffused shadow on hover) with `prefers-reduced-motion: reduce` respected globally.
- **Zero AI Slop:** No `animate-pulse`, no idle decorative indicator dots, no pill/capsule/eyebrow badges above section headings, and no generic gradient blobs.
- **Touch Targets:** Minimum `44px` height on interactive buttons, dropdowns, and inputs across mobile (`375px`), tablet (`768px`), and desktop (`1440px`).
