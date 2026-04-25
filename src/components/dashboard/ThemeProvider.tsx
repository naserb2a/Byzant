"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };
const ThemeContext = createContext<Ctx>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "byzant-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const TEAL = "#99E1D9";

export function tokens(theme: Theme) {
  return theme === "dark"
    ? {
        sidebarBg: "#000000",
        sidebarBorder: "rgba(255,255,255,0.08)",
        topbarBg: "#080c12",
        topbarBorder: "rgba(255,255,255,0.06)",
        contentBg: "#080c12",
        textPrimary: "#ffffff",
        textMuted: "#94a3b8",
        textFaint: "#64748b",
        hoverBg: "rgba(255,255,255,0.04)",
        activeTint: "rgba(153,225,217,0.08)",
        teal: TEAL,
      }
    : {
        sidebarBg: "#ffffff",
        sidebarBorder: "rgba(0,0,0,0.08)",
        topbarBg: "#ffffff",
        topbarBorder: "rgba(0,0,0,0.06)",
        contentBg: "#f5f5f5",
        textPrimary: "#111111",
        textMuted: "#666666",
        textFaint: "#888888",
        hoverBg: "rgba(0,0,0,0.04)",
        activeTint: "rgba(153,225,217,0.12)",
        teal: TEAL,
      };
}

export const SYSTEM_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
