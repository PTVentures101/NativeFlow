"use client";

import { FlashcardDeck } from "@/components/FlashcardDeck";
import Link from "next/link";

export default function FlashcardsPage() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* Header bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-[#f5f5f7]/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[11px] font-medium text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <h1 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Flashcards</h1>
        <div className="w-10" />
      </div>

      {/* Deck */}
      <div className="flex-1 pb-20 sm:pb-0">
        <FlashcardDeck />
      </div>
    </main>
  );
}
