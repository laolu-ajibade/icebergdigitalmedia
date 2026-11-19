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

interface NavItem {
  label: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "Operations & Orders",
    items: [
      {
        label: "Overview",
        subtitle: "Traffic & studio metrics",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "WhatsApp Orders",
        subtitle: "Client checkout ledger",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
    ],
  },
  {
    groupLabel: "Catalog & Content CMS",
    items: [
      {
        label: "Products",
        subtitle: "Products & volume pricing",
        href: "/admin/products",
        icon: Package,
      },
      {
        label: "Categories",
        subtitle: "Print & design taxonomy",
        href: "/admin/categories",
        icon: Layers,
      },
      {
        label: "Blogs",
        subtitle: "Articles & case studies",
        href: "/admin/blogs",
        icon: FileText,
      },
      {
        label: "Customer Reviews",
        subtitle: "Verified Google reviews",
        href: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    groupLabel: "System & Storefront",
    items: [
      {
        label: "Settings",
        subtitle: "Theme, hero, FAQs & socials",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

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
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileNavOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileNavOpen]);

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

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

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

  const activeNavItem =
    ALL_NAV_ITEMS.find((item) => item.href === pathname) || ALL_NAV_ITEMS[0];

  const renderNavigationContent = (onItemClick?: () => void) => (
    <>
      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupLabel} className="space-y-1.5">
            <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
              {group.groupLabel}
            </span>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={`group flex items-center justify-between gap-3 p-2.5 min-h-[48px] rounded-card transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-ink-body hover:bg-canvas-soft hover:text-ink border border-transparent hover:border-border/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-theme flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-black/15 text-primary-foreground"
                            : "bg-canvas-soft border border-border/60 text-ink-muted group-hover:text-primary group-hover:border-primary/30"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-display font-bold text-xs block truncate">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Storefront & Logout Card */}
      <div className="pt-4 mt-4 border-t border-border/60">
        <div className="p-2.5 rounded-card bg-canvas-soft border border-border/80 space-y-2">
          <Link
            href="/"
            onClick={onItemClick}
            className="w-full flex items-center justify-between px-3 py-2.5 min-h-[42px] rounded-button bg-card border border-border text-xs font-bold text-ink hover:border-primary/50 hover:text-primary transition-colors shadow-soft"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 min-h-[42px] rounded-button bg-red-50 hover:bg-red-100 border border-red-200/80 text-xs font-bold text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-canvas-soft flex flex-col md:flex-row">
      {/* Mobile Sticky Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between shadow-soft">
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 rounded-theme overflow-hidden bg-white p-0.5 border border-border/60 shadow-soft shrink-0">
            <Image
              src="/logo-icon.jpg"
              alt="Iceberg"
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <span className="font-display font-black text-sm text-ink block leading-tight">
              Iceberg Admin
            </span>
            <span className="text-[10px] font-semibold text-primary block truncate">
              {activeNavItem.label}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open navigation menu"
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-button bg-canvas-soft border border-border text-ink font-bold text-xs hover:bg-border/40 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4 text-primary" />
          <span>Menu</span>
        </button>
      </header>

      {/* Mobile Full-Height Slide-Over Navigation Drawer */}
      {isMobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <aside className="relative z-10 w-[86vw] max-w-[320px] h-full bg-card border-r border-border shadow-elevation p-5 flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
              <Link
                href="/admin"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="relative w-9 h-9 rounded-theme overflow-hidden bg-white shadow-soft p-0.5 border border-border/50 shrink-0">
                  <Image
                    src="/logo-icon.jpg"
                    alt="Iceberg"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-display font-black text-sm text-ink block leading-tight">
                    Iceberg Studio
                  </span>
                  <span className="text-[10px] text-primary font-bold tracking-wider uppercase">
                    Control Center
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 min-h-[38px] min-w-[38px] rounded-button bg-canvas-soft border border-border text-ink hover:bg-border/50 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {renderNavigationContent(() => setIsMobileNavOpen(false))}
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar Navigation */}
      <aside className="hidden md:flex md:w-72 md:sticky md:top-0 md:h-screen bg-card border-r border-border p-5 flex-col shrink-0">
        <div className="pb-4 mb-4 border-b border-border/60">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-theme overflow-hidden bg-white shadow-soft p-0.5 border border-border/50 shrink-0">
              <Image
                src="/logo-icon.jpg"
                alt="Iceberg"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-black text-sm text-ink block leading-tight">
                Iceberg Studio
              </span>
              <span className="text-[10px] text-primary font-bold tracking-wider uppercase">
                Admin Control Center
              </span>
            </div>
          </Link>
        </div>

        {renderNavigationContent()}
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto max-w-6xl">
        {children}
      </main>
    </div>
  );
}
