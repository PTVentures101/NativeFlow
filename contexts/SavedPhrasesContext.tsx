"use client";

import { createContext, useContext } from "react";
import { useSavedPhrases } from "@/hooks/useSavedPhrases";
import type { SavedPhrase, SaveStatus } from "@/types/savedPhrase";

interface SavedPhrasesContextValue {
  phrases: SavedPhrase[];
  isSaved: (phraseText: string) => boolean;
  save: (payload: Omit<SavedPhrase, "id" | "savedAt" | "status">) => void;
  unsave: (phraseText: string) => void;
  updateStatus: (phraseId: string, status: SaveStatus) => void;
  resetAll: () => void;
  isLoaded: boolean;
}

const SavedPhrasesContext = createContext<SavedPhrasesContextValue | null>(null);

export function SavedPhrasesProvider({ children }: { children: React.ReactNode }) {
  const value = useSavedPhrases();
  return (
    <SavedPhrasesContext.Provider value={value}>
      {children}
    </SavedPhrasesContext.Provider>
  );
}

export function useSavedPhrasesContext(): SavedPhrasesContextValue {
  const ctx = useContext(SavedPhrasesContext);
  if (!ctx) throw new Error("useSavedPhrasesContext must be used inside SavedPhrasesProvider");
  return ctx;
}
