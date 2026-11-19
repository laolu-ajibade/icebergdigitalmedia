"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    // Only track once per browser session
    const hasTracked = sessionStorage.getItem("iceberg_visit_logged");
    if (!hasTracked) {
      fetch("/api/analytics/visits", { method: "POST" })
        .then(() => {
          sessionStorage.setItem("iceberg_visit_logged", "true");
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
