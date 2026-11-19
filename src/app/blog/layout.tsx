import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Print Journal & Production Guides",
  description:
    "Practical guides on paper stocks, foil stamping, packaging engineering, CMYK proofing, and commercial branding from Iceberg Creative Print Studio in Shomolu, Lagos.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
