"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useToast } from "@/context/ToastContext";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess, showPopup } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      const msg = "Please enter both your administrator email and password.";
      setError(msg);
      showError(msg, "Missing Credentials");
      return;
    }

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
        showSuccess(
          "Welcome back to the Iceberg Admin Control Center.",
          "Authentication Successful"
        );
        const redirectPath = searchParams.get("redirect");
        const destination =
          redirectPath &&
          redirectPath.startsWith("/admin") &&
          redirectPath !== "/admin/login"
            ? redirectPath
            : "/admin";
        router.replace(destination);
        router.refresh();
      } else {
        const errMessage =
          data.error ||
          "Invalid administrator email or password. Please verify your credentials and try again.";
        setError(errMessage);
        showError(errMessage, "Sign-In Failed");
        showPopup({
          type: "error",
          title: "Authentication Failed",
          message: errMessage,
          actionLabel: "Try Again",
        });
      }
    } catch {
      const netMsg =
        "Unable to reach the authentication server. Please check your connection and try again.";
      setError(netMsg);
      showError(netMsg, "Network Error");
      showPopup({
        type: "error",
        title: "Connection Error",
        message: netMsg,
        actionLabel: "Retry",
      });
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
              src="/logo-icon.png?v=2"
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
          <div
            role="alert"
            className="p-3.5 rounded-theme bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@icebergprints.com"
                className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-button bg-canvas-soft border border-border text-xs text-ink focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                toggleLabel="password"
                className="pl-9 py-2.5 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 min-h-[44px] rounded-button bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-soft disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>
              {loading ? "Authenticating..." : "Sign In to Admin Portal"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
