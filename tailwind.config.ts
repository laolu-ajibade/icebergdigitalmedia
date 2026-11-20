import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
          pale: "var(--primary-pale)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        canvas: {
          DEFAULT: "var(--canvas)",
          soft: "var(--canvas-soft)",
          muted: "var(--canvas-muted)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          deep: "var(--ink-deep)",
          body: "var(--ink-body)",
          muted: "var(--ink-muted)",
        },
        border: "var(--border)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          border: "var(--card-border)",
        },
      },
      borderRadius: {
        theme: "var(--radius)",
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
      boxShadow: {
        elevation: "var(--shadow-elevation)",
        float: "0 20px 40px -15px rgba(0, 0, 0, 0.07)",
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.04)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Montserrat", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
