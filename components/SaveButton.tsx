"use client";

import { useSavedPhrasesContext } from "@/contexts/SavedPhrasesContext";
import type { SavedPhrase } from "@/types/savedPhrase";

type SavePayload = Omit<SavedPhrase, "id" | "savedAt" | "status">;

interface SaveButtonProps {
  payload: SavePayload;
  size?: "sm" | "md";
}

export function SaveButton({ payload, size = "md" }: SaveButtonProps) {
  const { isSaved, save, unsave, isLoaded } = useSavedPhrasesContext();
  const saved = isSaved(payload.phrase);

  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? 11 : 13;

  const handleClick = () => {
    if (!isLoaded) return;
    if (saved) {
      unsave(payload.phrase);
    } else {
      save(payload);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isLoaded}
      title={saved ? "Remove from flashcards" : "Save to flashcards"}
      className={`
        shrink-0 flex items-center justify-center ${dim} rounded-full border transition-all duration-200
        ${saved
          ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/25"
          : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/50"
        }
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      <BookmarkIcon size={iconSize} filled={saved} />
    </button>
  );
}

function BookmarkIcon({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
