"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "iceberg" | "wise";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("wise");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("iceberg-theme") as Theme | null;
    if (saved === "wise" || saved === "iceberg") {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      setThemeState("wise");
      document.documentElement.setAttribute("data-theme", "wise");
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
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
