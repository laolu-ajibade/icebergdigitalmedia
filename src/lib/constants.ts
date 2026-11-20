// Canonical Site URL for SEO, Sitemaps, and OpenGraph
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://icebergprints.com").replace(
    /\/+$/,
    ""
  );

// Centralized Asset & Cloudflare R2 Constants
export const R2_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_R2_URL ||
  process.env.R2_PUBLIC_URL ||
  "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev";

export const R2_IMAGES = {
  boxes: `${R2_PUBLIC_BASE}/iceberg/images/products/boxes.jpg`,
  clothes: `${R2_PUBLIC_BASE}/iceberg/images/products/clothes.jpg`,
  cups: `${R2_PUBLIC_BASE}/iceberg/images/products/cups.jpg`,
  bags: `${R2_PUBLIC_BASE}/iceberg/images/products/bags.jpg`,
  banner: `${R2_PUBLIC_BASE}/iceberg/images/products/banner.jpg`,
  businessCards: `${R2_PUBLIC_BASE}/iceberg/images/products/business-cards.jpg`,
  heroPackaging: `${R2_PUBLIC_BASE}/iceberg/images/hero/reel-packaging.jpg`,
  heroCards: `${R2_PUBLIC_BASE}/iceberg/images/hero/reel-cards.jpg`,
  heroApparel: `${R2_PUBLIC_BASE}/iceberg/images/hero/reel-apparel.jpg`,
  heroStationery: `${R2_PUBLIC_BASE}/iceberg/images/hero/reel-stationery.jpg`,
  logo: `${R2_PUBLIC_BASE}/iceberg/logo.png`,
  logoIcon: `${R2_PUBLIC_BASE}/iceberg/logo-icon.jpg`,
  favicon: `${R2_PUBLIC_BASE}/iceberg/favicon.ico`,
};

// Local offline fallback paths preserved so the app never breaks offline
export const LOCAL_DEFAULTS = {
  logo: "/logo.png",
  logoIcon: "/logo-icon.jpg",
  favicon: "/favicon.ico",
  placeholder: "/logo-icon.jpg",
};

// Contact & WhatsApp Configuration (configurable via environment variables)
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || "+234 802 309 3704";

// Clean raw digits for wa.me link (e.g. 2348023093704)
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  CONTACT_PHONE.replace(/[^0-9]/g, "");

export const getWhatsAppLink = (message: string = "") => {
  const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${textParam}`;
};
