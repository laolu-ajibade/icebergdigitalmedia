import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Print & Packaging Categories",
  description:
    "Browse commercial printing categories in Lagos — luxury business cards, rigid packaging boxes, branded apparel, ceramic mugs, jotters, stickers, and exhibition roll-up banners.",
  alternates: {
    canonical: "/categories",
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
