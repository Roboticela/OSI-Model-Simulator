"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface HeaderVisibilityContextType {
  headerVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
  toggleHeader: () => void;
}

const HeaderVisibilityContext = createContext<HeaderVisibilityContextType | undefined>(undefined);

export function HeaderVisibilityProvider({ children }: { children: ReactNode }) {
  const [headerVisible, setHeaderVisible] = useState(true);

  const toggleHeader = useCallback(() => {
    setHeaderVisible((v) => !v);
  }, []);

  return (
    <HeaderVisibilityContext.Provider value={{ headerVisible, setHeaderVisible, toggleHeader }}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
}

export function useHeaderVisibility() {
  const ctx = useContext(HeaderVisibilityContext);
  if (ctx === undefined) {
    throw new Error("useHeaderVisibility must be used within HeaderVisibilityProvider");
  }
  return ctx;
}
