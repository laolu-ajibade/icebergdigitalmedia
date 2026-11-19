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
