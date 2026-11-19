import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import "@/styles/globals.css";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iceberg Creative Print Studio | Turning Ideas Into Impressions",
  description:
    "Commercial Grade Digital Printing Press & Packaging Studio in Shomolu Lagos Nigeria. Bespoke rigid boxes, luxury business cards, branded apparel, mugs, and wide-format exhibition rollups with nationwide delivery.",
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
      data-theme="wise"
      className={`${displayFont.variable} ${sansFont.variable}`}
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
