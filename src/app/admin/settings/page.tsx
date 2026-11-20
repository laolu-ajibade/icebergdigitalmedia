"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  Check,
  ExternalLink,
  ShieldCheck,
  Building,
  Layers,
  BarChart3,
  Briefcase,
  Info,
  HelpCircle as FaqIcon,
  ListOrdered,
  KeyRound,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { CONTACT_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { clearSiteSettingsCache } from "@/lib/useSiteSettings";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";

type TabKey =
  | "contact"
  | "hero"
  | "mockup"
  | "stats"
  | "corporate"
  | "about"
  | "faqs"
  | "process"
  | "security";

const DEFAULT_STUDIO_ITEMS = [
  {
    id: "tshirt",
    label: "Apparel",
    price: 18500,
    minQty: 5,
    stockDesc: "420gsm Brushed Fleece Cotton",
    productSlug: "custom-heavyweight-branded-hoodie",
  },
  {
    id: "mug",
    label: "Drinkware",
    price: 3000,
    minQty: 12,
    stockDesc: "Grade AAA Glazed Ceramic",
    productSlug: "two-tone-ceramic-sublimation-mug",
  },
  {
    id: "card",
    label: "Business Card",
    price: 5000,
    minQty: 100,
    stockDesc: "600gsm Cotton Foil Board",
    productSlug: "curved-edge-luxury-business-cards",
  },
  {
    id: "jotter",
    label: "Jotters",
    price: 15000,
    minQty: 50,
    stockDesc: "A5 Hardcover Spiral Note Jotter",
    productSlug: "custom-hardcover-spiral-note-jotter",
  },
];

function normalizeStudioItems(rawItems: any[] | undefined) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return DEFAULT_STUDIO_ITEMS;
  }
  return DEFAULT_STUDIO_ITEMS.map(defItem => {
    const match = rawItems.find(
      (r: any) =>
        r.id === defItem.id || (defItem.id === "jotter" && r.id === "box"),
    );
    if (!match) return defItem;
    const isOldBox =
      defItem.id === "jotter" &&
      (match.id === "box" || match.label === "Rigid Box");
    return {
      ...defItem,
      ...match,
      id: defItem.id,
      label: isOldBox ? "Jotters" : match.label || defItem.label,
      price:
        isOldBox && match.price === 25000
          ? 15000
          : typeof match.price === "number"
            ? match.price
            : defItem.price,
      minQty:
        isOldBox && match.minQty === 25
          ? 50
          : typeof match.minQty === "number"
            ? match.minQty
            : defItem.minQty,
      stockDesc: isOldBox
        ? "A5 Hardcover Spiral Note Jotter"
        : match.stockDesc || defItem.stockDesc,
    };
  });
}

const SOCIAL_CHANNELS: Array<{
  field: string;
  label: string;
  prefix: string;
  placeholder: string;
}> = [
  {
    field: "instagramUrl",
    label: "Instagram Username",
    prefix: "https://instagram.com/",
    placeholder: "digitalmedia",
  },
  {
    field: "facebookUrl",
    label: "Facebook Page Username",
    prefix: "https://facebook.com/",
    placeholder: "digitalmedia",
  },
  {
    field: "twitterUrl",
    label: "Twitter / X Username",
    prefix: "https://x.com/",
    placeholder: "digitalmedia",
  },
  {
    field: "linkedinUrl",
    label: "LinkedIn Company / Profile Handle",
    prefix: "https://linkedin.com/company/",
    placeholder: "digitalmedia",
  },
  {
    field: "tiktokUrl",
    label: "TikTok Username",
    prefix: "https://tiktok.com/@",
    placeholder: "digitalmedia",
  },
  {
    field: "youtubeUrl",
    label: "YouTube Channel Handle",
    prefix: "https://youtube.com/@",
    placeholder: "digitalmedia",
  },
];

function extractSocialHandle(rawValue: string | undefined): string {
  if (!rawValue) return "";
  let cleaned = rawValue.trim();
  if (!cleaned) return "";
  cleaned = cleaned
    .replace(/^https?:\/\/(www\.)?[^/]+\/(company\/|in\/)?/i, "")
    .replace(/^@+/, "")
    .replace(/\/+$/, "");
  return cleaned;
}

export default function AdminSettingsPage() {
  const { setTheme } = useTheme();
  const { showError, showSuccess, showPopup } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("contact");
  const [settings, setSettings] = useState<any>({
    companyName: "",
    tagline: "",
    footerSummary: "",
    footerDescription: "",
    footerMotto: "",
    defaultTheme: "iceberg",
    topBarHoursText: "Mon - Sat: 09:00 - 18:00 (Shomolu, Lagos)",
    topBarTagline: "Commercial Grade Print Press & Packaging Studio",
    address: "",
    phone: CONTACT_PHONE,
    whatsappRouting: `+${WHATSAPP_NUMBER}`,
    email: "",
    workingHoursWeekday: "",
    workingHoursSaturday: "",
    workingHoursSunday: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    googlePlaceId: "",
    googleApiKey: "",
    deliveryPartners: [],
    heroHeadline: "",
    heroSubtext: "",
    heroPrimaryCtaText: "",
    heroPrimaryCtaLink: "",
    marqueeItems: [
      "600GSM COTTON BOARDS",
      "METALLIC FOIL STAMPING",
      "BESPOKE RIGID PACKAGING",
      "CALIBRATED CMYK PRESS",
      "DIRECT-TO-GARMENT FLEECE",
      "24–48HR LAGOS DISPATCH",
      "36 STATES DELIVERY",
      "SHOMOLU ATELIER",
    ],
    stats: [],
    corporateHeadline: "",
    corporateSubtext: "",
    corporatePerks: [],
    aboutHeadline: "",
    aboutStory: "",
    aboutChecks: [],
    aboutImage: "",
    faqs: [],
    processSteps: [],
    studioItems: DEFAULT_STUDIO_ITEMS,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [slugKey, setSlugKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", isError: false });

  const [newPerk, setNewPerk] = useState("");
  const [newCheck, setNewCheck] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const bottomSaveRef = useRef<HTMLDivElement | null>(null);
  const [isBottomSaveVisible, setIsBottomSaveVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const el = bottomSaveRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight - 10 && rect.bottom >= 0;
      setIsBottomSaveVisible(inView);
    };

    checkVisibility();

    const el = bottomSaveRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsBottomSaveVisible(entry.isIntersecting);
        },
        { threshold: 0.01, rootMargin: "0px 0px 20px 0px" },
      );
      observer.observe(el);
    }

    window.addEventListener("scroll", checkVisibility, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", checkVisibility, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", checkVisibility, { capture: true });
      window.removeEventListener("resize", checkVisibility);
    };
  }, [activeTab, settings]);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings((prev: any) => ({
            ...prev,
            ...data.settings,
            studioItems: normalizeStudioItems(data.settings.studioItems),
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        clearSiteSettingsCache();
        if (
          settings.defaultTheme === "wise" ||
          settings.defaultTheme === "iceberg" ||
          settings.defaultTheme === "brand"
        ) {
          setTheme(settings.defaultTheme);
        }
        setSuccess(true);
        showSuccess(
          "All studio settings have been saved to the database.",
          "Settings Saved",
        );
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error || "Failed to save studio settings.";
        showError(errMsg, "Save Failed");
        showPopup({
          type: "error",
          title: "Failed to Save Settings",
          message: errMsg,
        });
      }
    } catch {
      const netMsg = "Network error while saving settings.";
      showError(netMsg, "Connection Error");
      showPopup({
        type: "error",
        title: "Connection Error",
        message: netMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "New passwords do not match.", isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({
        text: "Password must be at least 6 characters.",
        isError: true,
      });
      return;
    }

    setPasswordLoading(true);
    setPasswordMsg({ text: "", isError: false });

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword || undefined,
          slugKey: slugKey || undefined,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({
          text: "Password updated successfully!",
          isError: false,
        });
        setCurrentPassword("");
        setSlugKey("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({
          text: data.error || "Password change failed.",
          isError: true,
        });
      }
    } catch (err: any) {
      setPasswordMsg({ text: err.message || "Network error.", isError: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "contact", label: "Studio & Socials", icon: Building },
    { key: "hero", label: "Hero & Intro", icon: Layers },
    { key: "mockup", label: "3D Mockup Pricing", icon: Layers },
    { key: "stats", label: "Studio Stats", icon: BarChart3 },
    { key: "corporate", label: "Corporate Perks", icon: Briefcase },
    { key: "about", label: "About Studio", icon: Info },
    { key: "faqs", label: "FAQ Accordion", icon: FaqIcon },
    { key: "process", label: "Process Steps", icon: ListOrdered },
    { key: "security", label: "Google API & Security", icon: KeyRound },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-border/60 pb-6">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
          Storefront Settings
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Centrally manage all dynamic homepage sections, headlines, FAQs,
          studio contacts, and social routing.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-theme bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Studio settings saved to database.</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-button text-xs font-bold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border text-ink-muted hover:text-ink hover:bg-canvas-soft"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
                Default Storefront Theme & Top Announcement Bar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Default Storefront Theme
                  </label>
                  <div className="relative">
                    <select
                      value={settings.defaultTheme || "iceberg"}
                      onChange={e => {
                        const chosen = e.target.value as
                          | "wise"
                          | "iceberg"
                          | "brand";
                        setSettings({ ...settings, defaultTheme: chosen });
                        setTheme(chosen);
                      }}
                      className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none bg-canvas-soft border border-border rounded-button text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:border-primary"
                    >
                      <option value="iceberg">
                        Iceberg Studio (Deep Navy & Cyan)
                      </option>
                      <option value="brand">
                        Iceberg Brand Manual (Deep Blue, Cyan & Gold)
                      </option>
                      <option value="wise">
                        Wise Canvas (Editorial Light & Lime)
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Top Banner & Support Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ""}
                    onChange={e =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    placeholder="+234 802 309 3704"
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Top Banner Hours & Location Summary
                  </label>
                  <input
                    type="text"
                    value={
                      settings.topBarHoursText ??
                      "Mon - Sat: 09:00 - 18:00 (Shomolu, Lagos)"
                    }
                    onChange={e =>
                      setSettings({
                        ...settings,
                        topBarHoursText: e.target.value,
                      })
                    }
                    placeholder="Mon - Sat: 09:00 - 18:00 (Shomolu, Lagos)"
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Top Banner Studio Descriptor
                  </label>
                  <input
                    type="text"
                    value={
                      settings.topBarTagline ??
                      "Commercial Grade Print Press & Packaging Studio"
                    }
                    onChange={e =>
                      setSettings({
                        ...settings,
                        topBarTagline: e.target.value,
                      })
                    }
                    placeholder="Commercial Grade Print Press & Packaging Studio"
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
                Studio Identity & Working Hours
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Company / Studio Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName || ""}
                    onChange={e =>
                      setSettings({ ...settings, companyName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Tagline / Motto
                  </label>
                  <input
                    type="text"
                    value={settings.tagline || ""}
                    onChange={e =>
                      setSettings({ ...settings, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-ink mb-1.5">
                    Footer Lead Summary
                  </label>
                  <textarea
                    rows={2}
                    value={settings.footerSummary ?? ""}
                    onChange={e =>
                      setSettings({ ...settings, footerSummary: e.target.value })
                    }
                    placeholder="Brand Identity, Graphic Design and Digital Printing Service"
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-ink mb-1.5">
                    Footer Secondary Description
                  </label>
                  <textarea
                    rows={2}
                    value={settings.footerDescription ?? ""}
                    onChange={e =>
                      setSettings({ ...settings, footerDescription: e.target.value })
                    }
                    placeholder="Full Responsive Websites and Application, Creative Branding, Graphic Design for Business Advertisement and High-quality Printing."
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-ink mb-1.5">
                    Footer Highlight Motto
                  </label>
                  <input
                    type="text"
                    value={settings.footerMotto ?? ""}
                    onChange={e =>
                      setSettings({ ...settings, footerMotto: e.target.value })
                    }
                    placeholder="Creativity as it speaks excellence!"
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-ink mb-1.5">
                    Physical Studio Address
                  </label>
                  <input
                    type="text"
                    value={settings.address || ""}
                    onChange={e =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Weekday Hours
                  </label>
                  <input
                    type="text"
                    value={settings.workingHoursWeekday || ""}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        workingHoursWeekday: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Saturday Hours
                  </label>
                  <input
                    type="text"
                    value={settings.workingHoursSaturday || ""}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        workingHoursSaturday: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
                Communications & WhatsApp Dispatch
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    WhatsApp Routing Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappRouting || ""}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        whatsappRouting: e.target.value,
                      })
                    }
                    placeholder={`+${WHATSAPP_NUMBER}`}
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Customer Support Phone (Display)
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ""}
                    onChange={e =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    placeholder={CONTACT_PHONE}
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-ink mb-1.5">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.email || ""}
                    onChange={e =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-4">
              <div>
                <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
                  Social Media
                </h2>
                <p className="text-[11px] text-ink-muted mt-2">
                  Enter only your username/handle for each platform (the base
                  URL prefix is locked automatically). Leave any username empty
                  to hide its icon from the storefront footer.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOCIAL_CHANNELS.map(channel => {
                  const currentHandle = extractSocialHandle(
                    settings[channel.field],
                  );
                  return (
                    <div key={channel.field}>
                      <label className="block font-bold text-ink mb-1.5">
                        {channel.label}
                      </label>
                      <div className="flex items-stretch rounded-button border border-border bg-canvas-soft overflow-hidden focus-within:border-primary">
                        <span className="px-3 py-2.5 bg-border/40 text-ink-muted font-mono text-[11px] border-r border-border select-none flex items-center shrink-0">
                          {channel.prefix}
                        </span>
                        <input
                          type="text"
                          value={currentHandle}
                          onChange={e => {
                            const handle = extractSocialHandle(e.target.value);
                            setSettings({
                              ...settings,
                              [channel.field]: handle
                                ? `${channel.prefix}${handle}`
                                : "",
                            });
                          }}
                          placeholder={channel.placeholder}
                          className="w-full min-w-0 px-3 py-2.5 min-h-[44px] bg-transparent text-ink font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-5">
            <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
              Homepage Hero Section
            </h2>
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Hero Headline *
              </label>
              <input
                type="text"
                required
                value={settings.heroHeadline || ""}
                onChange={e =>
                  setSettings({ ...settings, heroHeadline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-canvas-soft border border-border rounded-button text-ink font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Hero Subtitle / Description *
              </label>
              <textarea
                rows={3}
                required
                value={settings.heroSubtext || ""}
                onChange={e =>
                  setSettings({ ...settings, heroSubtext: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-canvas-soft border border-border rounded-button text-ink leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaText || ""}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      heroPrimaryCtaText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                />
              </div>
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Primary CTA Button Link
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaLink || ""}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      heroPrimaryCtaLink: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                />
              </div>
            </div>

            {/* Marquee Ticker Items */}
            <div className="pt-6 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-ink">
                    Scrolling Capability Strip (Marquee)
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Add, edit, or remove individual phrases shown in the scrolling dark banner below the Hero.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      marqueeItems: [...(settings.marqueeItems || []), "NEW CAPABILITY"],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover transition-colors shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Word</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(settings.marqueeItems || []).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const next = [...(settings.marqueeItems || [])];
                        next[idx] = e.target.value;
                        setSettings({ ...settings, marqueeItems: next });
                      }}
                      placeholder="e.g. 600GSM COTTON BOARDS"
                      className="flex-1 px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink text-xs font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (settings.marqueeItems || []).filter(
                          (_: string, i: number) => i !== idx,
                        );
                        setSettings({ ...settings, marqueeItems: next });
                      }}
                      aria-label={`Remove marquee item ${idx + 1}`}
                      className="p-2 rounded-button border border-border text-ink-muted hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border/60 space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-ink">
                  3D Print Studio Canvas Pricing (Interactive Customizer Section)
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Configure the dynamic starting run price (₦), minimum quantity
                  (pcs), and material specification for each of the 4
                  interactive 3D mockup tabs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(settings.studioItems || []).map((item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-theme bg-canvas-soft border border-border space-y-3"
                  >
                    <span className="font-bold text-primary uppercase text-[11px] block">
                      3D Canvas Item: {item.label || item.id}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-ink mb-1">
                          Tab Label
                        </label>
                        <input
                          type="text"
                          value={item.label || ""}
                          onChange={e => {
                            const next = [...settings.studioItems];
                            next[idx] = { ...next[idx], label: e.target.value };
                            setSettings({ ...settings, studioItems: next });
                          }}
                          className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-ink mb-1">
                          Starting Price (₦)
                        </label>
                        <input
                          type="number"
                          value={item.price ?? 0}
                          onChange={e => {
                            const next = [...settings.studioItems];
                            next[idx] = {
                              ...next[idx],
                              price: Number(e.target.value) || 0,
                            };
                            setSettings({ ...settings, studioItems: next });
                          }}
                          className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-ink mb-1">
                          Min Qty (pcs)
                        </label>
                        <input
                          type="number"
                          value={item.minQty ?? 1}
                          onChange={e => {
                            const next = [...settings.studioItems];
                            next[idx] = {
                              ...next[idx],
                              minQty: Number(e.target.value) || 1,
                            };
                            setSettings({ ...settings, studioItems: next });
                          }}
                          className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-ink mb-1">
                        Material / Stock Description
                      </label>
                      <input
                        type="text"
                        value={item.stockDesc || ""}
                        onChange={e => {
                          const next = [...settings.studioItems];
                          next[idx] = {
                            ...next[idx],
                            stockDesc: e.target.value,
                          };
                          setSettings({ ...settings, studioItems: next });
                        }}
                        className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "mockup" && (
          <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-5">
            <div className="border-b border-border/60 pb-3">
              <h2 className="font-display font-bold text-base text-ink">
                3D Print Studio Canvas Pricing (Apparel, Drinkware, Business
                Card & Jotters)
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Configure the dynamic Factory Starting Run price (₦), minimum
                quantity (pcs), tab label, and material description for each of
                the 4 interactive 3D mockup tabs on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(settings.studioItems || DEFAULT_STUDIO_ITEMS).map(
                (item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-theme bg-canvas-soft border border-border space-y-3"
                  >
                    <span className="font-bold text-primary uppercase text-[11px] block">
                      3D Mockup Item: {item.label || item.id}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-ink mb-1">
                          Tab Label
                        </label>
                        <input
                          type="text"
                          value={item.label || ""}
                          onChange={e => {
                            const next = [
                              ...(settings.studioItems || DEFAULT_STUDIO_ITEMS),
                            ];
                            next[idx] = { ...next[idx], label: e.target.value };
                            setSettings({ ...settings, studioItems: next });
                          }}
                          className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-ink mb-1">
                          Starting Price (₦)
                        </label>
                        <input
                          type="number"
                          value={item.price ?? 0}
                          onChange={e => {
                            const next = [
                              ...(settings.studioItems || DEFAULT_STUDIO_ITEMS),
                            ];
                            next[idx] = {
                              ...next[idx],
                              price: Number(e.target.value) || 0,
                            };
                            setSettings({ ...settings, studioItems: next });
                          }}
                          className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-ink mb-1">
                          Min Qty (pcs)
                        </label>
                        <input
                          type="number"
                          value={item.minQty ?? 1}
                          onChange={e => {
                            const next = [
                              ...(settings.studioItems || DEFAULT_STUDIO_ITEMS),
                            ];
                            next[idx] = {
                              ...next[idx],
                              minQty: Number(e.target.value) || 1,
                            };
                            setSettings({ ...settings, studioItems: next });
                          }}
                          className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-ink mb-1">
                        Material / Stock Description
                      </label>
                      <input
                        type="text"
                        value={item.stockDesc || ""}
                        onChange={e => {
                          const next = [
                            ...(settings.studioItems || DEFAULT_STUDIO_ITEMS),
                          ];
                          next[idx] = {
                            ...next[idx],
                            stockDesc: e.target.value,
                          };
                          setSettings({ ...settings, studioItems: next });
                        }}
                        className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink"
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-6">
            <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
              Studio Performance Metrics (4 Highlight Numbers)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(settings.stats || []).map((st: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-theme bg-canvas-soft border border-border space-y-3"
                >
                  <span className="font-bold text-primary block">
                    Metric 0{idx + 1}
                  </span>
                  <div>
                    <label className="block font-bold text-ink mb-1">
                      Figure / Value
                    </label>
                    <input
                      type="text"
                      value={st.value || ""}
                      onChange={e => {
                        const newStats = [...settings.stats];
                        newStats[idx] = {
                          ...newStats[idx],
                          value: e.target.value,
                        };
                        setSettings({ ...settings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">
                      Descriptive Label
                    </label>
                    <input
                      type="text"
                      value={st.label || ""}
                      onChange={e => {
                        const newStats = [...settings.stats];
                        newStats[idx] = {
                          ...newStats[idx],
                          label: e.target.value,
                        };
                        setSettings({ ...settings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "corporate" && (
          <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-5">
            <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
              Corporate Accounts & Enterprise Printing Banner
            </h2>
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={settings.corporateHeadline || ""}
                onChange={e =>
                  setSettings({
                    ...settings,
                    corporateHeadline: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-canvas-soft border border-border rounded-button text-ink font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Description Statement
              </label>
              <textarea
                rows={3}
                value={settings.corporateSubtext || ""}
                onChange={e =>
                  setSettings({ ...settings, corporateSubtext: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-canvas-soft border border-border rounded-button text-ink leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-2">
                Corporate Contract Perks
              </label>
              <div className="space-y-2 mb-3">
                {(settings.corporatePerks || []).map(
                  (perk: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={perk}
                        onChange={e => {
                          const newPerks = [...settings.corporatePerks];
                          newPerks[idx] = e.target.value;
                          setSettings({
                            ...settings,
                            corporatePerks: newPerks,
                          });
                        }}
                        className="flex-1 px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPerks = settings.corporatePerks.filter(
                            (_: any, i: number) => i !== idx,
                          );
                          setSettings({
                            ...settings,
                            corporatePerks: newPerks,
                          });
                        }}
                        className="p-2 text-ink-muted hover:text-red-600 rounded-button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPerk}
                  onChange={e => setNewPerk(e.target.value)}
                  placeholder="Add a new perk bullet point..."
                  className="flex-1 px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newPerk.trim()) return;
                    setSettings({
                      ...settings,
                      corporatePerks: [
                        ...(settings.corporatePerks || []),
                        newPerk.trim(),
                      ],
                    });
                    setNewPerk("");
                  }}
                  className="px-4 py-2 bg-canvas border border-border hover:bg-canvas-soft rounded-button text-ink font-semibold"
                >
                  Add Perk
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-5">
            <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
              About Story & Workshop Image
            </h2>
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={settings.aboutHeadline || ""}
                onChange={e =>
                  setSettings({ ...settings, aboutHeadline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-canvas-soft border border-border rounded-button text-ink font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Studio Narrative Story
              </label>
              <textarea
                rows={4}
                value={settings.aboutStory || ""}
                onChange={e =>
                  setSettings({ ...settings, aboutStory: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-canvas-soft border border-border rounded-button text-ink leading-relaxed"
              />
            </div>

            <div>
              <R2ImageUpload
                folder="products"
                value={settings.aboutImage || ""}
                onChange={url => setSettings({ ...settings, aboutImage: url })}
                label="Studio Workshop Image"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-2">
                Studio Quality Bullet Points
              </label>
              <div className="space-y-2 mb-3">
                {(settings.aboutChecks || []).map(
                  (check: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={check}
                        onChange={e => {
                          const newChecks = [...settings.aboutChecks];
                          newChecks[idx] = e.target.value;
                          setSettings({ ...settings, aboutChecks: newChecks });
                        }}
                        className="flex-1 px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newChecks = settings.aboutChecks.filter(
                            (_: any, i: number) => i !== idx,
                          );
                          setSettings({ ...settings, aboutChecks: newChecks });
                        }}
                        className="p-2 text-ink-muted hover:text-red-600 rounded-button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCheck}
                  onChange={e => setNewCheck(e.target.value)}
                  placeholder="Add quality guarantee..."
                  className="flex-1 px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newCheck.trim()) return;
                    setSettings({
                      ...settings,
                      aboutChecks: [
                        ...(settings.aboutChecks || []),
                        newCheck.trim(),
                      ],
                    });
                    setNewCheck("");
                  }}
                  className="px-4 py-2 bg-canvas border border-border hover:bg-canvas-soft rounded-button text-ink font-semibold"
                >
                  Add Bullet
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-6">
            <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
              Frequently Asked Questions (Accordion)
            </h2>
            <div className="space-y-4">
              {(settings.faqs || []).map((faq: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-theme bg-canvas-soft border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      Question 0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = settings.faqs.filter(
                          (_: any, i: number) => i !== idx,
                        );
                        setSettings({ ...settings, faqs: newFaqs });
                      }}
                      className="text-ink-muted hover:text-red-600 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">
                      Question Title
                    </label>
                    <input
                      type="text"
                      value={faq.question || ""}
                      onChange={e => {
                        const newFaqs = [...settings.faqs];
                        newFaqs[idx] = {
                          ...newFaqs[idx],
                          question: e.target.value,
                        };
                        setSettings({ ...settings, faqs: newFaqs });
                      }}
                      className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">
                      Answer Explanation
                    </label>
                    <textarea
                      rows={3}
                      value={faq.answer || ""}
                      onChange={e => {
                        const newFaqs = [...settings.faqs];
                        newFaqs[idx] = {
                          ...newFaqs[idx],
                          answer: e.target.value,
                        };
                        setSettings({ ...settings, faqs: newFaqs });
                      }}
                      className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-theme bg-canvas border border-border/80 space-y-3">
              <h4 className="font-bold text-ink">Add New Question</h4>
              <input
                type="text"
                value={newFaqQ}
                onChange={e => setNewFaqQ(e.target.value)}
                placeholder="Question (e.g. Do you print on metallic foil?)"
                className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
              />
              <textarea
                rows={2}
                value={newFaqA}
                onChange={e => setNewFaqA(e.target.value)}
                placeholder="Answer explanation..."
                className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newFaqQ.trim() || !newFaqA.trim()) return;
                  setSettings({
                    ...settings,
                    faqs: [
                      ...(settings.faqs || []),
                      { question: newFaqQ.trim(), answer: newFaqA.trim() },
                    ],
                  });
                  setNewFaqQ("");
                  setNewFaqA("");
                }}
                className="px-5 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-button hover:bg-primary-hover transition-colors"
              >
                Insert FAQ
              </button>
            </div>
          </div>
        )}

        {activeTab === "process" && (
          <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-6">
            <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
              How Ordering Works (3 Process Steps)
            </h2>
            <div className="space-y-4">
              {(settings.processSteps || []).map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-theme bg-canvas-soft border border-border space-y-3"
                >
                  <span className="font-bold text-primary">
                    Step {step.stepNumber || idx + 1}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-ink mb-1">
                        Step Number
                      </label>
                      <input
                        type="text"
                        value={step.stepNumber || ""}
                        onChange={e => {
                          const newSteps = [...settings.processSteps];
                          newSteps[idx] = {
                            ...newSteps[idx],
                            stepNumber: e.target.value,
                          };
                          setSettings({ ...settings, processSteps: newSteps });
                        }}
                        className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-ink mb-1">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title || ""}
                        onChange={e => {
                          const newSteps = [...settings.processSteps];
                          newSteps[idx] = {
                            ...newSteps[idx],
                            title: e.target.value,
                          };
                          setSettings({ ...settings, processSteps: newSteps });
                        }}
                        className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">
                      Step Description
                    </label>
                    <textarea
                      rows={2}
                      value={step.description || ""}
                      onChange={e => {
                        const newSteps = [...settings.processSteps];
                        newSteps[idx] = {
                          ...newSteps[idx],
                          description: e.target.value,
                        };
                        setSettings({ ...settings, processSteps: newSteps });
                      }}
                      className="w-full px-3 py-2 bg-card border border-border rounded-button text-ink leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display font-bold text-base text-ink">
                    Google Business Places API Credentials
                  </h2>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Connect live streaming reviews from your registered Google
                    Business Profile.
                  </p>
                </div>
                <a
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Place ID Finder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Google Place ID (Read-Only)
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={
                      settings.googlePlaceId || "ChIJvQSY9_iNOxARaGAAOwEgnZA"
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink-muted cursor-not-allowed select-none opacity-80"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Google Places API Key (Read-Only)
                  </label>
                  <input
                    type="password"
                    readOnly
                    disabled
                    value={
                      settings.googleApiKey ||
                      "••••••••••••••••••••••••••••••••••••"
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink-muted font-mono cursor-not-allowed select-none opacity-80"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-card border border-border p-6 md:p-8 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Change Administrator Password</span>
              </h2>

              {passwordMsg.text && (
                <div
                  className={`p-3 rounded-theme text-xs font-semibold ${
                    passwordMsg.isError
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 pr-10 bg-canvas-soft border border-border rounded-button text-ink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      aria-label={
                        showPasswords.current
                          ? "Hide current password"
                          : "Show current password"
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Admin Security Slug Key
                  </label>
                  <input
                    type="text"
                    value={slugKey}
                    onChange={e => setSlugKey(e.target.value)}
                    placeholder="iceberg-admin-reset-2026"
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.next ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 pr-10 bg-canvas-soft border border-border rounded-button text-ink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          next: !prev.next,
                        }))
                      }
                      aria-label={
                        showPasswords.next
                          ? "Hide new password"
                          : "Show new password"
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      {showPasswords.next ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3 py-2 pr-10 bg-canvas-soft border border-border rounded-button text-ink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      aria-label={
                        showPasswords.confirm
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                  className="px-5 py-2.5 rounded-button bg-ink text-white font-bold text-xs hover:bg-ink/90 transition-colors shadow-soft"
                >
                  {passwordLoading
                    ? "Updating Password..."
                    : "Update Security Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar: static at the very bottom on mobile, sticky on tablet/desktop */}
        <div
          ref={bottomSaveRef}
          className="sm:sticky sm:bottom-4 z-20 bg-card/90 backdrop-blur-md p-4 rounded-card border border-border shadow-elevation flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
        >
          <span className="text-xs text-ink-muted text-center sm:text-left">
            All edits update live across the storefront, instant estimators, and
            WhatsApp routing.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 min-h-[44px] rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft shrink-0 cursor-pointer"
          >
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>

        {/* Mobile-Only Fixed Floating Save Icon Button (Unmounts when bottom Save button is visible) */}
        {!isBottomSaveVisible && (
          <button
            type="submit"
            disabled={saving}
            aria-label="Save All Settings"
            title="Save All Settings"
            className="sm:hidden fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-elevation border border-border/20 flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Save className="w-7 h-7" />
            )}
          </button>
        )}
      </form>
    </div>
  );
}
