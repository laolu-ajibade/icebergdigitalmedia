"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@icebergprints.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid administrator credentials");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-card border border-border/80 shadow-elevation p-8 md:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-12 h-12 rounded-theme mx-auto overflow-hidden bg-white shadow-soft p-1 border border-border/40">
            <Image
              src="/logo-icon.jpg"
              alt="Iceberg Studio"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-display font-black text-2xl text-ink">
            Admin Control Center
          </h1>
          <p className="text-xs text-ink-muted">
            Iceberg Creative Print Studio Management Console
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-theme bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@icebergprints.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-button bg-canvas-soft border border-border text-xs text-ink focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-button bg-canvas-soft border border-border text-xs text-ink focus:outline-none focus:border-primary"
              />
            </div>
            <p className="text-[11px] text-ink-muted mt-1.5">
              Default credentials: <code className="bg-canvas-muted px-1.5 py-0.5 rounded text-ink font-semibold">admin@icebergprints.com</code> / <code className="bg-canvas-muted px-1.5 py-0.5 rounded text-ink font-semibold">admin123</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-button bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-soft disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
