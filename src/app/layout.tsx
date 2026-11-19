import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { SITE_URL, R2_IMAGES } from "@/lib/constants";
import "@/styles/globals.css";

const displayFont = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const montserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
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
    icon: "/logo-icon.jpg",
    shortcut: "/logo-icon.jpg",
    apple: "/logo-icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="iceberg"
      className={`${displayFont.variable} ${sansFont.variable} ${montserratFont.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
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
