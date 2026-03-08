"use client";

import { useState, useEffect } from "react";

export const SOURCE_LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "Portuguese",
  "Italian",
  "German",
  "Dutch",
  "Polish",
  "Russian",
  "Arabic",
  "Japanese",
  "Korean",
  "Mandarin Chinese",
  "Hindi",
] as const;

export type SourceLanguage = (typeof SOURCE_LANGUAGES)[number];

const STORAGE_KEY = "nativevibe_source_lang";
const DEFAULT: SourceLanguage = "English";

export function useSourceLanguage() {
  const [sourceLang, setSourceLangState] = useState<SourceLanguage>(DEFAULT);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SourceLanguage | null;
      if (stored && (SOURCE_LANGUAGES as readonly string[]).includes(stored)) {
        setSourceLangState(stored);
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const setSourceLang = (lang: SourceLanguage) => {
    setSourceLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  };

  return { sourceLang, setSourceLang, isLoaded };
}
