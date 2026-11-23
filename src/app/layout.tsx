import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, type Theme } from "@/context/ThemeContext";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { SITE_URL, R2_IMAGES } from "@/lib/constants";
import "@/styles/globals.css";

const displayFont = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Iceberg Creative Print Studio | Commercial Printing & Packaging in Lagos",
    template: "%s | Iceberg Creative Print Studio",
  },
  description:
    "Commercial digital printing press and bespoke packaging studio in Shomolu, Lagos. Custom rigid boxes, luxury business cards, branded apparel, mugs, jotters, and exhibition banners delivered across Nigeria.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "Iceberg Creative Print Studio",
    title:
      "Iceberg Creative Print Studio | Commercial Printing & Packaging in Lagos",
    description:
      "High-definition digital press, bespoke rigid packaging, branded apparel, and corporate collateral produced in Shomolu, Lagos with nationwide delivery.",
    images: [
      {
        url: R2_IMAGES.boxes,
        width: 1200,
        height: 630,
        alt: "Iceberg Creative Print Studio — Commercial Printing & Bespoke Packaging in Lagos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Iceberg Creative Print Studio | Commercial Printing & Packaging in Lagos",
    description:
      "Commercial printing, rigid boxes, business cards, branded apparel, and custom jotters in Shomolu, Lagos.",
    images: [R2_IMAGES.boxes],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "64x64" },
    ],
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

const VALID_THEMES: Theme[] = ["iceberg", "wise", "brand", "editorial"];

async function getInitialTheme(): Promise<Theme> {
  noStore();
  try {
    await connectDB();
    const settings = (await SiteSettings.findOne({}, { defaultTheme: 1 }).lean()) as {
      defaultTheme?: string;
    } | null;
    if (settings?.defaultTheme && VALID_THEMES.includes(settings.defaultTheme as Theme)) {
      return settings.defaultTheme as Theme;
    }
  } catch {
    // Fall back to Iceberg Brand Manual when DB is unavailable
  }
  return "brand";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getInitialTheme();

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <ThemeProvider initialTheme={initialTheme}>
          <ToastProvider>
            <CartProvider>
              <VisitTracker />
              <TopBanner />
              <Navbar />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
