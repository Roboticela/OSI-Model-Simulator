"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type ThemeName = "navy" | "dark" | "light" | "sunset" | "ocean" | "forest" | "purple" | "midnight";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  glowEnabled: boolean;
  toggleGlow: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [glowEnabled, setGlowEnabled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeName;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (themeName: ThemeName) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", themeName);
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleGlow = () => {
    setGlowEnabled((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, glowEnabled, toggleGlow }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

