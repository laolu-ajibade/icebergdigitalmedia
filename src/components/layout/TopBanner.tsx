"use client";

import React from "react";
import { Phone, Clock, MessageSquare } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { CONTACT_PHONE, WHATSAPP_NUMBER, getWhatsAppLink } from "@/lib/constants";

export function TopBanner() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-ink text-canvas-soft border-b border-border/10 text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6 flex-wrap">
          <a
            href={`tel:${WHATSAPP_NUMBER}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>{CONTACT_PHONE}</span>
          </a>
          <div className="hidden sm:flex items-center gap-1.5 opacity-80">
            <Clock className="w-3.5 h-3.5" />
            <span>Mon - Sat: 09:00 - 18:00 (Shomolu, Lagos)</span>
          </div>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:inline text-white/80">Commercial Grade Print Press & Packaging Studio</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center px-2.5 py-1 rounded-button bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px]"
            title="Toggle between Wise Canvas and Iceberg Brand design systems"
          >
            <span>Theme: {theme === "wise" ? "Wise Canvas" : "Iceberg Studio"}</span>
          </button>

          <a
            href={getWhatsAppLink("Hello Iceberg Studio, I have an inquiry regarding commercial printing.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Quick Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}
