"use client";

import React, { useState, useEffect } from "react";
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
  Trash2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { CONTACT_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";
import { R2ImageUpload } from "@/components/ui/R2ImageUpload";
import { clearSiteSettingsCache } from "@/lib/useSiteSettings";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";

type TabKey =
  | "contact"
  | "hero"
  | "stats"
  | "corporate"
  | "about"
  | "faqs"
  | "process"
  | "security";

export default function AdminSettingsPage() {
  const { setTheme } = useTheme();
  const { showError, showSuccess, showPopup } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("contact");
  const [settings, setSettings] = useState<any>({
    companyName: "",
    tagline: "",
    defaultTheme: "wise",
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
    heroSecondaryCtaText: "",
    heroSecondaryCtaLink: "",
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
    studioItems: [],
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [slugKey, setSlugKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", isError: false });

  const [newPerk, setNewPerk] = useState("");
  const [newCheck, setNewCheck] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
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
          settings.defaultTheme === "iceberg"
        ) {
          setTheme(settings.defaultTheme);
        }
        setSuccess(true);
        showSuccess("All studio settings have been saved to the database.", "Settings Saved");
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
    { key: "stats", label: "Studio Stats", icon: BarChart3 },
    { key: "corporate", label: "Corporate Perks", icon: Briefcase },
    { key: "about", label: "About Studio", icon: Info },
    { key: "faqs", label: "FAQ Accordion", icon: FaqIcon },
    { key: "process", label: "Process Steps", icon: ListOrdered },
    { key: "security", label: "Google API & Security", icon: KeyRound },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
            Studio CMS & Storefront Settings
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Centrally manage all dynamic homepage sections, headlines, FAQs,
            studio contacts, and social routing.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft shrink-0"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
        </button>
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
                      value={settings.defaultTheme || "wise"}
                      onChange={e => {
                        const chosen = e.target.value as "wise" | "iceberg";
                        setSettings({ ...settings, defaultTheme: chosen });
                        setTheme(chosen);
                      }}
                      className="w-full px-4 py-3 pr-10 min-h-[44px] appearance-none bg-canvas-soft border border-border rounded-button text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:border-primary"
                    >
                      <option value="wise">
                        Wise Canvas (Editorial Light & Lime)
                      </option>
                      <option value="iceberg">
                        Iceberg Studio (Deep Navy & Cyan)
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
              <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
                Social Media Profiles & Channels
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={settings.instagramUrl || ""}
                    onChange={e =>
                      setSettings({ ...settings, instagramUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Facebook Page URL
                  </label>
                  <input
                    type="text"
                    value={settings.facebookUrl || ""}
                    onChange={e =>
                      setSettings({ ...settings, facebookUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Twitter / X Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.twitterUrl || ""}
                    onChange={e =>
                      setSettings({ ...settings, twitterUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.linkedinUrl || ""}
                    onChange={e =>
                      setSettings({ ...settings, linkedinUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    TikTok Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.tiktokUrl || ""}
                    onChange={e =>
                      setSettings({ ...settings, tiktokUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={settings.youtubeUrl || ""}
                    onChange={e =>
                      setSettings({ ...settings, youtubeUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
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
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Secondary CTA Button Label
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaText || ""}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      heroSecondaryCtaText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                />
              </div>
              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Secondary CTA Button Link
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaLink || ""}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      heroSecondaryCtaLink: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border/60 space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-ink">
                  3D Print Studio Canvas Pricing (Interactive Hero Mockup Stage)
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Configure the dynamic starting run price (₦), minimum quantity (pcs), and material specification for each of the 4 interactive 3D mockup tabs.
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
                        <label className="block font-bold text-ink mb-1">Tab Label</label>
                        <input
                          type="text"
                          value={item.label || ""}
                          onChange={(e) => {
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
                          onChange={(e) => {
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
                          onChange={(e) => {
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
                        onChange={(e) => {
                          const next = [...settings.studioItems];
                          next[idx] = { ...next[idx], stockDesc: e.target.value };
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
              About Studio Story & Workshop Image
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
                    value={settings.googlePlaceId || "ChIJvQSY9_iNOxARaGAAOwEgnZA"}
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
                    value={settings.googleApiKey || "••••••••••••••••••••••••••••••••••••"}
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
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
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
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full px-3 py-2 bg-canvas-soft border border-border rounded-button text-ink"
                  />
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

        <div className="sticky bottom-4 z-20 bg-card/90 backdrop-blur-md p-4 rounded-card border border-border shadow-elevation flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            All edits update live across the storefront, instant estimators, and
            WhatsApp routing.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-button bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-soft"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
