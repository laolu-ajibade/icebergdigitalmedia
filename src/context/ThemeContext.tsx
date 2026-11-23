"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export type Theme = "iceberg" | "wise" | "brand" | "editorial";

const VALID_THEMES: Theme[] = ["iceberg", "wise", "brand", "editorial"];
const isValidTheme = (value: unknown): value is Theme =>
  typeof value === "string" && VALID_THEMES.includes(value as Theme);

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "brand",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const settings = useSiteSettings();
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [userOverrode, setUserOverrode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!userOverrode && isValidTheme(settings?.defaultTheme)) {
      setThemeState(settings.defaultTheme);
    }
  }, [settings?.defaultTheme, userOverrode]);

  const setTheme = (newTheme: Theme) => {
    setUserOverrode(true);
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleTheme = () => {
    const order: Theme[] = ["brand", "iceberg", "editorial", "wise"];
    const nextTheme = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
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
