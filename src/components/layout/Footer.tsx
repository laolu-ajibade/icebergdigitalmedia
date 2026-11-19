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
  const address =
    settings?.address ||
    "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria.";
  const phone = settings?.phone || CONTACT_PHONE;
  const whatsapp =
    (settings?.whatsappRouting || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;
  const email = settings?.email || "hazkendigital@gmail.com";
  const hoursWeekday = settings?.workingHoursWeekday || "09:00 - 18:00";
  const hoursSat = settings?.workingHoursSaturday || "10:00 - 18:00";
  const hoursSun = settings?.workingHoursSunday || "Closed";

  const facebookUrl = settings?.facebookUrl || "https://facebook.com/hazkendigital";
  const instagramUrl = settings?.instagramUrl || "https://instagram.com/hazkendigital";
  const twitterUrl = settings?.twitterUrl || "https://x.com/hazkendigital";
  const linkedinUrl =
    settings?.linkedinUrl || "https://linkedin.com/company/hazkendigital";
  const youtubeUrl = settings?.youtubeUrl || "https://youtube.com/@hazkendigital";

  const buildWaLink = (msg: string) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  return (
    <footer className="bg-[#0b0f19] text-[#e2e8f0] pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-theme bg-white p-0.5 overflow-hidden flex items-center justify-center">
                <Image
                  src="/logo-icon.jpg"
                  alt={companyName}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg text-white">
                  {companyName}
                </span>
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                  {tagline}
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed">
              Web Design, UI UX Design, Brand Identity, Graphic Design and Digital Printing Service in Lagos Nigeria.
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              Full Responsive Websites and Application, Creative Branding, Graphic Design for Business Advertisement and High-quality Printing.
            </p>
            <p className="text-xs text-primary font-semibold italic">
              Creativity as it speaks excellence!
            </p>
          </div>

          <div className="space-y-3.5 text-xs text-white/80">
            <h4 className="font-display font-bold text-sm text-white mb-4">
              Lagos Studio & Factory
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <a href={`tel:${whatsapp}`} className="hover:text-primary transition-colors">
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                {email}
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p>
                  Mon - Fri: <strong className="text-white">{hoursWeekday}</strong>
                </p>
                <p>
                  Sat: <strong className="text-white">{hoursSat}</strong> · Sun: {hoursSun}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-amber-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary transition-colors">
                  Service & Print Categories
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog & Print Journal
                </Link>
              </li>
              <li>
                <a href="#about-studio" className="hover:text-primary transition-colors">
                  About Studio
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-primary transition-colors">
                  Contact & Inquiries
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Admin Control Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="font-display font-bold text-xs text-amber-400 mb-3">
                Follow us on:
              </h4>
              <div className="flex items-center gap-2">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-theme bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90"
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
                    className="w-8 h-8 rounded-theme bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90"
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
                    className="w-8 h-8 rounded-theme bg-black text-white flex items-center justify-center hover:opacity-90 font-bold text-xs"
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
                    className="w-8 h-8 rounded-theme bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90"
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
                    className="w-8 h-8 rounded-theme bg-[#ff0000] text-white flex items-center justify-center hover:opacity-90"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-xs text-amber-400 mb-2">
                Chat with us on:
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href={buildWaLink("Hello Iceberg Studio Team, I have an inquiry.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-theme bg-[#25D366] text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://m.me/hazkendigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-theme bg-[#0084ff] text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Chat on Messenger"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-xs text-amber-400 mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery Partners:</span>
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded-theme bg-[#00A859] text-white font-black text-[10px] tracking-wider">
                  KWIK
                </span>
                <span className="text-white/40">+</span>
                <span className="px-2 py-1 rounded-theme bg-[#34D186] text-[#0f172a] font-black text-[10px] tracking-wider">
                  BOLT
                </span>
                <span className="text-white/40">+</span>
                <span className="px-2 py-1 rounded-theme bg-white text-[#d03238] font-black text-[10px] tracking-wider">
                  GIG LOGISTICS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            Copyright © 2019 - 2026 Hazken Digital / {companyName}. All Rights Reserved.
          </p>
          <a
            href={buildWaLink("Hello Iceberg Studio, I need assistance.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-button bg-[#d03238] hover:bg-[#b5262c] text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Send Message...</span>
          </a>
        </div>
      </div>

      <a
        href={buildWaLink(
          "Hello Iceberg Creative Print Studio, I would like to order commercial prints."
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-elevation flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Direct WhatsApp Print Desk"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </footer>
  );
}
