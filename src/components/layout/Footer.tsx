"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Truck,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
} from "lucide-react";
import { CONTACT_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function Footer() {
  const pathname = usePathname();
  const settings = useSiteSettings();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const companyName = settings?.companyName || "Iceberg Studio";
  const tagline = settings?.tagline || "Creative Print Press";
  const footerSummary =
    settings?.footerSummary ??
    "Brand Identity, Graphic Design and Digital Printing Service in Lagos Nigeria.";
  const footerDescription =
    settings?.footerDescription ??
    "We Create Experiences ThatInspire, Impact And Transform!";
  const footerMotto =
    settings?.footerMotto ?? "Creativity as it speaks excellence!";
  const address = settings?.address || "Somolu, Lagos";
  const address2 =
    settings?.address2 || "14/17 Lateef Eletu Street, Awoyaya, Lagos";
  const phone = settings?.phone || CONTACT_PHONE;
  const whatsapp =
    (settings?.whatsappRouting || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;
  const email = settings?.email || "icebergcreativeprintstudio@gmail.com";
  const hoursWeekday = settings?.workingHoursWeekday || "09:00 - 18:00";
  const hoursSat = settings?.workingHoursSaturday || "10:00 - 18:00";
  const hoursSun = settings?.workingHoursSunday || "Closed";

  const resolveSocialUrl = (val: string | undefined, prefix: string) => {
    const trimmed = (val ?? "").trim();
    if (!trimmed) return "";
    const handle = trimmed
      .replace(/^https?:\/\/(www\.)?[^/]+\/(company\/|in\/)?/i, "")
      .replace(/^@+/, "")
      .replace(/\/+$/, "");
    return handle ? `${prefix}${handle}` : "";
  };

  const facebookUrl = resolveSocialUrl(
    settings?.facebookUrl,
    "https://facebook.com/",
  );
  const instagramUrl = resolveSocialUrl(
    settings?.instagramUrl,
    "https://instagram.com/",
  );
  const twitterUrl = resolveSocialUrl(settings?.twitterUrl, "https://x.com/");
  const linkedinUrl = resolveSocialUrl(
    settings?.linkedinUrl,
    "https://linkedin.com/company/",
  );
  const youtubeUrl = resolveSocialUrl(
    settings?.youtubeUrl,
    "https://youtube.com/@",
  );
  const tiktokUrl = resolveSocialUrl(
    settings?.tiktokUrl,
    "https://tiktok.com/@",
  );
  const hasAnySocial = Boolean(
    facebookUrl ||
    instagramUrl ||
    twitterUrl ||
    linkedinUrl ||
    youtubeUrl ||
    tiktokUrl,
  );

  const facebookHandle = (settings?.facebookUrl ?? "")
    .trim()
    .replace(/^https?:\/\/(www\.)?facebook\.com\//i, "")
    .replace(/^@+/, "")
    .replace(/\/+$/, "");
  const messengerUrl = facebookHandle ? `https://m.me/${facebookHandle}` : "";

  const buildWaLink = (msg: string) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  return (
    <footer className="bg-[#0b0f19] text-[#e2e8f0] pt-12 sm:pt-16 pb-24 sm:pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          {/* Column 1: Brand Identity */}
          <div className="space-y-3.5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png?v=3"
                alt={companyName}
                width={260}
                height={84}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>

            {footerSummary && (
              <p className="text-xs text-white/75 leading-relaxed">
                {footerSummary}
              </p>
            )}
            {footerDescription && (
              <p className="text-xs text-white/60 leading-relaxed">
                {footerDescription}
              </p>
            )}
            {footerMotto && (
              <p className="text-xs text-primary font-semibold italic">
                {footerMotto}
              </p>
            )}
          </div>

          {/* Column 2: Lagos Studio & Factory */}
          <div className="p-4 sm:p-0 rounded-card sm:rounded-none bg-white/[0.03] sm:bg-transparent border border-white/10 sm:border-0 space-y-3.5 text-xs text-white/80">
            <h4 className="font-display font-bold text-sm text-white">
              Lagos Studio & Factory
            </h4>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-theme bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <p className="leading-relaxed">{address}</p>
            </div>
            {address2 && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-theme bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <p className="leading-relaxed">{address2}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-theme bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <a
                href={`tel:${whatsapp}`}
                className="hover:text-primary transition-colors font-medium"
              >
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-theme bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <a
                href={`mailto:${email}`}
                className="hover:text-primary transition-colors break-all"
              >
                {email}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-theme bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 leading-relaxed">
                <p>
                  Mon - Fri:{" "}
                  <strong className="text-white">{hoursWeekday}</strong>
                </p>
                <p>
                  Sat: <strong className="text-white">{hoursSat}</strong> · Sun:{" "}
                  {hoursSun}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links (2 columns on mobile, 1 column on desktop) */}
          <div className="p-4 sm:p-0 rounded-card sm:rounded-none bg-white/[0.03] sm:bg-transparent border border-white/10 sm:border-0">
            <h4 className="font-display font-bold text-sm text-amber-400 mb-3.5">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5 text-xs text-white/80">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/#about-studio"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq-section"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials, Chat & Logistics */}
          <div className="p-4 sm:p-0 rounded-card sm:rounded-none bg-white/[0.03] sm:bg-transparent border border-white/10 sm:border-0 space-y-5">
            {hasAnySocial && (
              <div>
                <h4 className="font-display font-bold text-xs text-amber-400 mb-2.5">
                  Follow us on:
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-theme bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-theme bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-theme bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition-colors font-bold text-xs"
                      aria-label="X (Twitter)"
                    >
                      𝕏
                    </a>
                  )}
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-theme bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-theme bg-[#ff0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-theme bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="TikTok"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.26 8.26 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.17z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-display font-bold text-xs text-amber-400 mb-2.5">
                Chat with us on:
              </h4>
              <div className="flex items-center gap-2.5">
                <a
                  href={buildWaLink(
                    "Hello Iceberg Studio Team, I have an inquiry.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 min-h-[38px] rounded-theme bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                {messengerUrl && (
                  <a
                    href={messengerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 min-h-[38px] rounded-theme bg-[#0084ff] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    aria-label="Chat on Messenger"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Messenger</span>
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-xs text-amber-400 mb-2.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery Partners:</span>
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-theme bg-[#00A859] text-white font-black text-[10px] tracking-wider">
                  KWIK
                </span>
                <span className="text-white/40">+</span>
                <span className="px-2.5 py-1 rounded-theme bg-[#34D186] text-[#0f172a] font-black text-[10px] tracking-wider">
                  BOLT
                </span>
                <span className="text-white/40">+</span>
                <span className="px-2.5 py-1 rounded-theme bg-white text-[#d03238] font-black text-[10px] tracking-wider">
                  GIG LOGISTICS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Action Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p className="text-center sm:text-left leading-relaxed">
            Copyright © 2019 - 2026 {companyName}. All Rights Reserved.{" "}
            <span className="text-white/35">
              · By{" "}
              <a
                href="https://www.linkedin.com/in/olaoluwa-ajibade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/80 transition-colors underline decoration-white/20 underline-offset-2"
              >
                D&apos;Maker Inc
              </a>
            </span>
          </p>
          <a
            href={buildWaLink("Hello Iceberg Studio, I need assistance.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-button bg-[#d03238] hover:bg-[#b5262c] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-soft"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Message...</span>
          </a>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={buildWaLink(
          "Hello Iceberg Creative Print Studio, I would like to order commercial prints.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-elevation flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Direct WhatsApp Print Desk"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
    </footer>
  );
}
