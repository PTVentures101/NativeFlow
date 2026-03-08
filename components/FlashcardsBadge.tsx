"use client";

import { useSavedPhrasesContext } from "@/contexts/SavedPhrasesContext";

export function FlashcardsBadge() {
  const { phrases, isLoaded } = useSavedPhrasesContext();
  const count = phrases.filter((p) => p.status === "learning").length;

  return (
    <span className="flex items-center gap-1.5">
      Flashcards
      {isLoaded && count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[10px] font-semibold leading-none">
          {count}
        </span>
      )}
    </span>
  );
}
