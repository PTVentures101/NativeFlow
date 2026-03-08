"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { SavedPhrase, SaveStatus } from "@/types/savedPhrase";

const STORAGE_KEY = "nativevibe_phrases";

function loadFromStorage(): SavedPhrase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPhrase[]) : [];
  } catch {
    return [];
  }
}

function persist(phrases: SavedPhrase[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
}

export function useSavedPhrases() {
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setPhrases(loadFromStorage());
    setIsLoaded(true);
  }, []);

  const savedSet = useMemo(
    () => new Set(phrases.map((p) => p.phrase)),
    [phrases]
  );

  const isSaved = useCallback(
    (phraseText: string) => savedSet.has(phraseText),
    [savedSet]
  );

  const save = useCallback(
    (payload: Omit<SavedPhrase, "id" | "savedAt" | "status">) => {
      setPhrases((prev) => {
        if (prev.some((p) => p.phrase === payload.phrase)) return prev; // dedup
        const next: SavedPhrase = {
          ...payload,
          id: crypto.randomUUID(),
          savedAt: Date.now(),
          status: "learning",
        };
        const updated = [...prev, next];
        persist(updated);
        return updated;
      });
    },
    []
  );

  const unsave = useCallback((phraseText: string) => {
    setPhrases((prev) => {
      const updated = prev.filter((p) => p.phrase !== phraseText);
      persist(updated);
      return updated;
    });
  }, []);

  const updateStatus = useCallback((phraseId: string, status: SaveStatus) => {
    setPhrases((prev) => {
      const updated = prev.map((p) => (p.id === phraseId ? { ...p, status } : p));
      persist(updated);
      return updated;
    });
  }, []);

  const resetAll = useCallback(() => {
    setPhrases((prev) => {
      const updated = prev.map((p) => ({ ...p, status: "learning" as SaveStatus }));
      persist(updated);
      return updated;
    });
  }, []);

  return { phrases, isSaved, save, unsave, updateStatus, resetAll, isLoaded };
}
