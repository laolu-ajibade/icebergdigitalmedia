"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

type Theme = "iceberg" | "wise";

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
    const saved = localStorage.getItem("iceberg-theme") as Theme | null;
    if (saved === "wise" || saved === "iceberg") {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "iceberg");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      !userOverrode &&
      (settings?.defaultTheme === "wise" || settings?.defaultTheme === "iceberg")
    ) {
      const dbTheme = settings.defaultTheme as Theme;
      setThemeState(dbTheme);
      localStorage.setItem("iceberg-theme", dbTheme);
      document.documentElement.setAttribute("data-theme", dbTheme);
    }
  }, [settings?.defaultTheme, userOverrode]);

  const setTheme = (newTheme: Theme) => {
    setUserOverrode(true);
    setThemeState(newTheme);
    localStorage.setItem("iceberg-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "wise" ? "iceberg" : "wise";
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
