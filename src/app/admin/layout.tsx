"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  ShoppingBag,
  Settings,
  Star,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    let isMounted = true;
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok || !data.authenticated) {
          throw new Error(
            "Unauthorized access: Please sign in to access the Admin Control Center."
          );
        }

        if (isMounted) {
          setAuthStatus("authenticated");
          setAuthError("");
        }
      } catch (err: any) {
        if (isMounted) {
          const errMsg =
            err.message ||
            "Unauthorized access: Please sign in to access the Admin Control Center.";
          setAuthStatus("unauthenticated");
          setAuthError(errMsg);
          showError(errMsg, "Authentication Required");
          const target = `/admin/login?error=unauthorized&redirect=${encodeURIComponent(
            pathname
          )}`;
          router.replace(target);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, showError]);

  // If on login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Block protected content while verifying or when unauthenticated
  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-canvas-soft flex flex-col items-center justify-center p-6 text-ink-muted space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-semibold">
          Verifying administrator session...
        </p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-card border border-red-200 p-8 shadow-elevation text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-display font-black text-lg text-ink">
            Authentication Required
          </h2>
          <p className="text-xs text-red-600 font-medium leading-relaxed">
            {authError ||
              "Unauthorized access: You must be signed in to view the Admin Control Center."}
          </p>
          <p className="text-[11px] text-ink-muted">
            Redirecting to Admin Sign In...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthStatus("unauthenticated");
    showSuccess("You have been safely signed out.", "Signed Out");
    router.replace("/admin/login");
    router.refresh();
  };

  const navItems = [
    { label: "Overview & Analytics", href: "/admin", icon: LayoutDashboard },
    { label: "Product Catalog", href: "/admin/products", icon: Package },
    { label: "Categories (10+)", href: "/admin/categories", icon: Layers },
    { label: "Print Journal (Blogs)", href: "/admin/blogs", icon: FileText },
    { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
    { label: "WhatsApp Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Settings & Google API", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-canvas-soft flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-theme overflow-hidden bg-white p-0.5 border border-border/50">
            <Image
              src="/logo-icon.jpg"
              alt="Iceberg"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display font-bold text-sm text-ink">
            Iceberg Admin
          </span>
        </Link>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-button bg-canvas-soft text-ink"
        >
          {isMobileNavOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-card border-r border-border p-6 flex flex-col justify-between shrink-0 ${
          isMobileNavOpen ? "block" : "hidden md:flex"
        }`}
      >
        <div className="space-y-6">
          <Link href="/admin" className="hidden md:flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-theme overflow-hidden bg-white shadow-soft p-0.5 border border-border/50">
              <Image
                src="/logo-icon.jpg"
                alt="Iceberg"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-ink block">
                Iceberg Studio
              </span>
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">
                Admin Control
              </span>
            </div>
          </Link>

          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-button text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-ink-body hover:bg-canvas-soft hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-border/60 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-button text-xs font-medium text-ink-muted hover:text-ink hover:bg-canvas-soft transition-colors"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-button text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">
        {children}
      </main>
    </div>
  );
}
