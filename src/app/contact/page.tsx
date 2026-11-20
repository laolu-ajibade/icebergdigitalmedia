import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Phone, MessageSquare, ExternalLink } from "lucide-react";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { CONTACT_PHONE, WHATSAPP_NUMBER, R2_IMAGES } from "@/lib/constants";
import { ContactFormClient } from "@/components/contact/ContactFormClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach Iceberg Creative Print Studio in Shomolu, Lagos for commercial printing, custom packaging quotes, and nationwide delivery.",
};

export default async function ContactPage() {
  let settings: any = null;
  try {
    await connectDB();
    const s = await SiteSettings.findOne().lean();
    settings = s ? JSON.parse(JSON.stringify(s)) : null;
  } catch {
    // Graceful fallback
  }

  const phone = settings?.phone || CONTACT_PHONE;
  const whatsapp =
    (settings?.whatsappRouting || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;
  const email = settings?.email || "icebergcreativeprintstudio@gmail.com";
  const address = settings?.address || "Somolu, Lagos";
  const address2 =
    settings?.address2 || "14/17 Lateef Eletu Street, Awoyaya, Lagos";
  const heroImage = settings?.heroImage || R2_IMAGES.heroPackaging;

  const contactHeadline = settings?.contactHeadline || "We're Here to Help.";
  const contactSubtext =
    settings?.contactSubtext ||
    "We always want to hear from you! Let us know how we can help with your next print run or brand rollout.";
  const formHeadline =
    settings?.contactFormHeadline ||
    "Have a project? Let's make something great together!";
  const formSubtext =
    settings?.contactFormSubtext ||
    "Get in touch with our Shomolu production desk to see how we can bring your print project to life.";

  const mapQuery = encodeURIComponent(address);

  return (
    <div className="bg-canvas">
      {/* Full-Bleed Dark Contact Banner */}
      <section className="relative h-56 sm:h-64 flex items-center justify-center bg-ink overflow-hidden text-center">
        <Image
          src={heroImage}
          alt="Contact Iceberg Creative Print Studio"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 px-4 space-y-2 text-white">
          <p className="text-xs sm:text-sm font-semibold text-white/85">
            Call us at {phone}
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Centered Intro */}
      <section className="pt-12 pb-8 px-4 text-center max-w-2xl mx-auto space-y-2.5">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
          {contactHeadline}
        </h2>
        <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
          {contactSubtext}
        </p>
      </section>

      {/* 3-Column Contact Hub (Info Card | Google Map | Project Form) */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Dark Address/Email/Phone Card */}
          <div className="lg:col-span-3 relative rounded-card overflow-hidden bg-ink text-white p-6 flex flex-col justify-center space-y-6 shadow-elevation min-h-[340px]">
            <Image
              src={settings?.aboutImage || R2_IMAGES.boxes}
              alt="Iceberg Studio Shomolu"
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover opacity-20"
            />
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Address</span>
                </div>
                <p className="text-xs sm:text-sm text-white leading-relaxed">
                  {address}
                </p>
                {address2 && (
                  <p className="text-xs sm:text-sm text-white leading-relaxed mt-1.5">
                    {address2}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>E-mail</span>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="text-xs sm:text-sm text-white hover:text-primary transition-colors break-all block"
                >
                  {email}
                </a>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>Phone</span>
                </div>
                <a
                  href={`tel:${whatsapp}`}
                  className="text-xs sm:text-sm text-white hover:text-primary transition-colors block"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Center: Embedded Google Map */}
          <div className="lg:col-span-4 relative rounded-card overflow-hidden border border-card-border shadow-soft min-h-[340px] bg-canvas-soft">
            <iframe
              title="Iceberg Studio Lagos Location"
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[340px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-card/95 backdrop-blur-md border border-border text-[11px] font-semibold text-ink shadow-soft hover:text-primary transition-colors"
            >
              <span>Open in Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Right: Project Inquiry Form */}
          <div className="lg:col-span-5 bg-card rounded-card border border-card-border p-6 sm:p-8 shadow-soft flex flex-col justify-center">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-ink leading-snug">
              {formHeadline}
            </h3>
            <p className="text-xs sm:text-sm text-ink-body mt-2 mb-6 leading-relaxed">
              {formSubtext}
            </p>
            <ContactFormClient whatsapp={whatsapp} />
          </div>
        </div>
      </section>

      {/* Bottom 2-Column Support Row */}
      <section className="py-12 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-sm text-ink">
              Join us on Chat
            </h4>
            <p className="text-xs text-ink-muted">
              Have quick print or artwork questions? Chat directly with our press desk on{" "}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
              .
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-sm text-ink">
              General communication
            </h4>
            <p className="text-xs text-ink-muted">
              For corporate contracts or partnership inquiries, email{" "}
              <a
                href={`mailto:${email}`}
                className="text-primary font-semibold hover:underline"
              >
                {email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
