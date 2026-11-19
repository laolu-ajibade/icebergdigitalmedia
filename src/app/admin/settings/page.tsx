"use client";

import React, { useState, useEffect } from "react";
import { Save, Check, ExternalLink, ShieldCheck, HelpCircle } from "lucide-react";
import { CONTACT_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    companyName: "Iceberg Creative Print Studio",
    tagline: "Turning Ideas Into Impressions....",
    address: "25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria",
    phone: CONTACT_PHONE,
    whatsappRouting: `+${WHATSAPP_NUMBER}`,
    email: "hazkendigital@gmail.com",
    workingHoursWeekday: "09:00 - 18:00",
    workingHoursSaturday: "10:00 - 18:00",
    workingHoursSunday: "Closed",
    facebookUrl: "https://facebook.com/hazkendigital",
    instagramUrl: "https://instagram.com/hazkendigital",
    twitterUrl: "https://x.com/hazkendigital",
    linkedinUrl: "https://linkedin.com/company/hazkendigital",
    youtubeUrl: "https://youtube.com/@hazkendigital",
    tiktokUrl: "https://tiktok.com/@hazkendigital",
    googlePlaceId: "",
    googleApiKey: "",
    deliveryPartners: ["Kwik Delivery", "Bolt Logistics", "GIG Logistics"],
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [slugKey, setSlugKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", isError: false });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "New passwords do not match.", isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: "Password must be at least 6 characters.", isError: true });
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
      if (res.ok && data.success) {
        setPasswordMsg({ text: "Admin password updated successfully!", isError: false });
        setCurrentPassword("");
        setSlugKey("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ text: data.error || "Failed to update password.", isError: true });
      }
    } catch {
      setPasswordMsg({ text: "Network error occurred.", isError: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
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
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display font-black text-2xl text-ink">
          Studio Settings & Integrations
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Configure WhatsApp routing numbers, Shomolu studio contact information, social profiles, and Google Places API credentials.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-theme bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Studio settings updated successfully across the storefront and API routes.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Google Business Reviews Setup Guide & Inputs */}
        <div className="bg-card rounded-card border border-border/80 p-6 md:p-8 shadow-soft space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display font-bold text-base text-ink">
                Google Business Reviews Integration
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Connect live customer reviews from your Google Maps profile to the homepage.
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

          <div className="p-4 rounded-theme bg-primary-pale/40 border border-primary/30 space-y-2 text-[11px] text-ink-body">
            <h4 className="font-bold text-ink flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span>What is needed to set this up:</span>
            </h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open Google Cloud Console (console.cloud.google.com) and enable the <strong>Places API (New)</strong>.</li>
              <li>Create an <strong>API Key</strong> under Credentials.</li>
              <li>Find your registered Google business <strong>Place ID</strong> using Google's Place ID Finder tool.</li>
              <li>Enter both fields below. When saved, our server will query the Google Places API directly!</li>
              <li><em>Note: If left blank, the website automatically falls back to 5 verified authentic 5-star studio reviews.</em></li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Google Place ID
              </label>
              <input
                type="text"
                value={settings.googlePlaceId || ""}
                onChange={(e) => setSettings({ ...settings, googlePlaceId: e.target.value })}
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                className="w-full px-3 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Google Places API Key
              </label>
              <input
                type="password"
                value={settings.googleApiKey || ""}
                onChange={(e) => setSettings({ ...settings, googleApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 rounded-button bg-canvas-soft border border-border text-ink font-mono"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Studio Communications */}
        <div className="bg-card rounded-card border border-border/80 p-6 md:p-8 shadow-soft space-y-4">
          <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
            WhatsApp Routing & Lagos Studio Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Primary WhatsApp Dispatch Phone Number *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappRouting || ""}
                onChange={(e) => setSettings({ ...settings, whatsappRouting: e.target.value })}
                placeholder={`+${WHATSAPP_NUMBER}`}
                className="w-full px-3 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
              />
              <p className="text-[11px] text-ink-muted mt-1">
                All cart checkout inquiries and instant estimator orders will route to this WhatsApp number.
              </p>
            </div>

            <div>
              <label className="block font-bold text-ink mb-1.5">
                Studio Contact Phone (Display)
              </label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder={CONTACT_PHONE}
                className="w-full px-3 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-ink mb-1.5">
                Studio & Press Address
              </label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="25, Akeju Street, Off Apata Street, Shomolu, Lagos Nigeria"
                className="w-full px-3 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="hazkendigital@gmail.com"
                className="w-full px-3 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-1.5">
                Weekday Hours (Mon - Fri)
              </label>
              <input
                type="text"
                value={settings.workingHoursWeekday || ""}
                onChange={(e) => setSettings({ ...settings, workingHoursWeekday: e.target.value })}
                placeholder="09:00 - 18:00"
                className="w-full px-3 py-2.5 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card rounded-card border border-border/80 p-6 md:p-8 shadow-soft space-y-4">
          <h2 className="font-display font-bold text-base text-ink border-b border-border/60 pb-3">
            Social Media & Delivery Partners
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-ink mb-1.5">Facebook URL</label>
              <input
                type="text"
                value={settings.facebookUrl || ""}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1.5">Instagram URL</label>
              <input
                type="text"
                value={settings.instagramUrl || ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1.5">X (Twitter) URL</label>
              <input
                type="text"
                value={settings.twitterUrl || ""}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1.5">LinkedIn URL</label>
              <input
                type="text"
                value={settings.linkedinUrl || ""}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>
          </div>
        </div>

        {/* Password & Security Management */}
        <div className="bg-card rounded-card border border-border/80 p-6 md:p-8 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="font-display font-bold text-base text-ink">
                Admin Password & Authentication Security
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Change your login password using your current password or via the secret <code className="bg-canvas-soft px-1 rounded font-mono">ADMIN_PASSWORD_SLUG_KEY</code> defined in your environment.
              </p>
            </div>
            <div className="w-8 h-8 rounded-theme bg-primary-pale text-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-bold text-ink mb-1.5">
                Current Password (If logged in)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-1.5">
                OR Secret Slug Key (From .env)
              </label>
              <input
                type="text"
                value={slugKey}
                onChange={(e) => setSlugKey(e.target.value)}
                placeholder="e.g. iceberg-secure-slug-key-2026"
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-1.5">
                New Password (Min 6 characters)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-ink"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-ink-muted">
              API also available at <code className="font-mono bg-canvas-soft px-1 rounded">/api/admin/auth/reset-password/[slugKey]</code>
            </span>
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={passwordLoading || !newPassword}
              className="px-4 py-2 rounded-button bg-ink hover:bg-ink-deep text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-button bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs transition-colors shadow-soft flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save All Studio Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
