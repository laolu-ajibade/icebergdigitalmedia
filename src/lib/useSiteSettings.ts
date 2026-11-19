"use client";

import { useState, useEffect } from "react";

let cachedSettings: any = null;
let pendingPromise: Promise<any> | null = null;

export function clearSiteSettingsCache() {
  cachedSettings = null;
  pendingPromise = null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<any>(cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      return;
    }

    if (!pendingPromise) {
      pendingPromise = fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          cachedSettings = data.settings || null;
          return cachedSettings;
        })
        .catch(() => null);
    }

    pendingPromise.then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  return settings;
}
