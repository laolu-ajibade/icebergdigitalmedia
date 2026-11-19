"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Phone, Clock, MessageSquare } from "lucide-react";
import { CONTACT_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function TopBanner() {
  const pathname = usePathname();
  const settings = useSiteSettings();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const phone = settings?.phone || CONTACT_PHONE;
  const whatsapp =
    (settings?.whatsappRouting || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;
  const hoursWeekday = settings?.workingHoursWeekday || "09:00 - 18:00";
  const topBarHoursText =
    settings?.topBarHoursText || `Mon - Sat: ${hoursWeekday} (Shomolu, Lagos)`;
  const topBarTagline =
    settings?.topBarTagline ||
    "Commercial Grade Print Press & Packaging Studio";

  return (
    <div className="bg-ink text-canvas-soft border-b border-border/10 text-[11px] sm:text-xs py-2 px-3.5 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <a
            href={`tel:${whatsapp}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-semibold whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{phone}</span>
          </a>

          <div className="hidden md:flex items-center gap-1.5 opacity-80 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{topBarHoursText}</span>
          </div>

          {topBarTagline && (
            <>
              <span className="hidden xl:inline text-white/40">•</span>
              <span className="hidden xl:inline text-white/80 truncate">
                {topBarTagline}
              </span>
            </>
          )}
        </div>

        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
            "Hello Iceberg Studio, I have an inquiry regarding commercial printing."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-primary hover:underline font-semibold whitespace-nowrap shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span>WhatsApp Quick Desk</span>
        </a>
      </div>
    </div>
  );
}
