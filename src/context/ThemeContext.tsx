"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

type Theme = "iceberg" | "wise" | "brand";

const VALID_THEMES: Theme[] = ["iceberg", "wise", "brand"];
const isValidTheme = (value: unknown): value is Theme =>
  typeof value === "string" && VALID_THEMES.includes(value as Theme);

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useSiteSettings();
  const [theme, setThemeState] = useState<Theme>("iceberg");
  const [userOverrode, setUserOverrode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("iceberg-theme");
    if (isValidTheme(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "iceberg");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userOverrode && isValidTheme(settings?.defaultTheme)) {
      const dbTheme = settings.defaultTheme;
      setThemeState(dbTheme);
      localStorage.setItem("iceberg-theme", dbTheme);
      document.documentElement.setAttribute("data-theme", dbTheme);
    }
  }, [settings?.defaultTheme, userOverrode]);

  useEffect(() => {
    if (theme !== "brand") return;
    if (document.getElementById("montserrat-brand-font")) return;
    const link = document.createElement("link");
    link.id = "montserrat-brand-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setUserOverrode(true);
    setThemeState(newTheme);
    localStorage.setItem("iceberg-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleTheme = () => {
    const order: Theme[] = ["iceberg", "brand", "wise"];
    const nextTheme = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={!mounted ? "invisible" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
