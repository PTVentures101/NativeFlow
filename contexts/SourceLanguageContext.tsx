"use client";

import { createContext, useContext } from "react";
import { useSourceLanguage } from "@/hooks/useSourceLanguage";
import type { SourceLanguage } from "@/hooks/useSourceLanguage";

interface SourceLanguageContextValue {
  sourceLang: SourceLanguage;
  setSourceLang: (lang: SourceLanguage) => void;
  isLoaded: boolean;
}

const SourceLanguageContext = createContext<SourceLanguageContextValue | null>(null);

export function SourceLanguageProvider({ children }: { children: React.ReactNode }) {
  const value = useSourceLanguage();
  return (
    <SourceLanguageContext.Provider value={value}>
      {children}
    </SourceLanguageContext.Provider>
  );
}

export function useSourceLanguageContext(): SourceLanguageContextValue {
  const ctx = useContext(SourceLanguageContext);
  if (!ctx) throw new Error("useSourceLanguageContext must be used inside SourceLanguageProvider");
  return ctx;
}
