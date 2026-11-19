"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const hasTracked = sessionStorage.getItem("iceberg_visit_logged");
    if (!hasTracked) {
      fetch("/api/analytics/visits", { method: "POST" })
        .then(() => {
          sessionStorage.setItem("iceberg_visit_logged", "true");
        })
        .catch(() => {});
    }
  }, [pathname]);

  return null;
}
