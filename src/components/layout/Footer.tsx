"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { CONTACT_PHONE, WHATSAPP_NUMBER, getWhatsAppLink } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#0b0f19] text-[#e2e8f0] pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info & Motto */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-theme bg-white p-0.5 overflow-hidden flex items-center justify-center">
                <Image
                  src="/logo-icon.jpg"
                  alt="Iceberg Print Studio"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg text-white">
                  Iceberg Studio
                </span>
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                  Creative Print Press
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

          {/* Contact Details & Hours */}
          <div className="space-y-3.5 text-xs text-white/80">
            <h4 className="font-display font-bold text-sm text-white mb-4">
              Lagos Studio & Factory
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-primary transition-colors">
                {CONTACT_PHONE}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a href="mailto:hazkendigital@gmail.com" className="hover:text-primary transition-colors">
                hazkendigital@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p>Mon - Fri: <strong className="text-white">09:00 - 18:00</strong></p>
                <p>Sat: <strong className="text-white">10:00 - 18:00</strong> · Sun: Closed</p>
              </div>
            </div>
          </div>

          {/* Quick Links & Service Categories */}
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

          {/* Socials, Chat, Logistics */}
          <div className="space-y-5">
            <div>
              <h4 className="font-display font-bold text-xs text-amber-400 mb-3">
                Follow us on:
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com/hazkendigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-theme bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/hazkendigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-theme bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/hazkendigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-theme bg-black text-white flex items-center justify-center hover:opacity-90 font-bold text-xs"
                  aria-label="X (Twitter)"
                >
                  𝕏
                </a>
                <a
                  href="https://linkedin.com/company/hazkendigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-theme bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@hazkendigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-theme bg-[#ff0000] text-white flex items-center justify-center hover:opacity-90"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-xs text-amber-400 mb-2">
                Chat with us on:
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink("Hello Iceberg Studio Team, I have an inquiry.")}
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

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            Copyright © 2019 - 2026 Hazken Digital / Iceberg Creative Print Studio. All Rights Reserved.
          </p>
          <a
            href={getWhatsAppLink("Hello Iceberg Studio, I need assistance.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-button bg-[#d03238] hover:bg-[#b5262c] text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Send Message...</span>
          </a>
        </div>
      </div>

      {/* Floating WhatsApp Action Trigger */}
      <a
        href={getWhatsAppLink("Hello Iceberg Creative Print Studio, I would like to order commercial prints.")}
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
