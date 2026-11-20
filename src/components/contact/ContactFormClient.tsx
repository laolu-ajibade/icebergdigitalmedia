"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactFormClient({ whatsapp }: { whatsapp: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const text = `Hello Iceberg Studio,\nName: ${name.trim()}\nEmail: ${email.trim() || "N/A"}\nProject Brief: ${message.trim()}`;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (sent) setSent(false);
          }}
          placeholder="Your Name *"
          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
        />
      </div>

      <textarea
        rows={4}
        required
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (sent) setSent(false);
        }}
        placeholder="Tell us about your print run, quantity, and finishing..."
        className="w-full px-3.5 py-2.5 rounded-button bg-canvas-soft border border-border text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary resize-none"
      />

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-button bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs uppercase tracking-wider transition-colors shadow-soft cursor-pointer"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Send Message</span>
      </button>

      {sent && (
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Opening WhatsApp with your project brief.</span>
        </div>
      )}
    </form>
  );
}
