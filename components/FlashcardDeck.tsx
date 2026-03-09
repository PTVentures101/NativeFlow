"use client";

import { useState } from "react";
import { useSavedPhrasesContext } from "@/contexts/SavedPhrasesContext";
import type { SavedPhrase } from "@/types/savedPhrase";
import Link from "next/link";

export function FlashcardDeck() {
  const { phrases, isLoaded, updateStatus, resetAll } = useSavedPhrasesContext();

  const learning = phrases.filter((p) => p.status === "learning");
  const mastered = phrases.filter((p) => p.status === "mastered");

  // Local queue: start with learning phrases, may grow as "Still learning" pushes to end
  const [queue, setQueue] = useState<SavedPhrase[]>(() => [...learning]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sync queue when phrases load (only once, when isLoaded transitions)
  const [initialized, setInitialized] = useState(false);
  if (isLoaded && !initialized) {
    setInitialized(true);
    setQueue([...learning]);
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-full max-w-lg h-16 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" style={{ opacity: 1 - i * 0.25 }} />
        ))}
      </div>
    );
  }

  // Empty state
  if (phrases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <BookmarkIcon />
        </div>
        <div>
          <p className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">No saved phrases yet</p>
          <p className="text-sm text-[#86868b] mt-1">Tap the bookmark icon on any phrase to save it here.</p>
        </div>
        <Link href="/" className="mt-2 text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
          Start analysing →
        </Link>
      </div>
    );
  }

  const currentCard = queue[currentIndex] ?? null;

  // All mastered state
  if (!currentCard || queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <CheckIcon />
        </div>
        <div>
          <p className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">All caught up!</p>
          <p className="text-sm text-[#86868b] mt-1">
            You&apos;ve mastered all {mastered.length} phrase{mastered.length !== 1 ? "s" : ""} in this session.
          </p>
        </div>
        <button
          onClick={() => {
            resetAll();
            const reset = phrases.map((p) => ({ ...p, status: "learning" as const }));
            setQueue(reset);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="mt-2 text-sm font-medium text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          Reset all and drill again
        </button>
      </div>
    );
  }

  const remaining = queue.length - currentIndex;
  const total = queue.length;

  const handleFlip = () => setIsFlipped((f) => !f);

  const handleGotIt = () => {
    updateStatus(currentCard.id, "mastered");
    const next = currentIndex + 1;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(next), 150);
  };

  const handleStillLearning = () => {
    // Move current card to end of queue
    setQueue((prev) => {
      const updated = [...prev];
      const [card] = updated.splice(currentIndex, 1);
      updated.push(card);
      return updated;
    });
    setIsFlipped(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 w-full max-w-lg mx-auto">

      {/* Progress */}
      <div className="flex items-center justify-between w-full text-[11px] font-medium text-[#86868b]">
        <span>{remaining} of {total} remaining</span>
        <span>{mastered.length} mastered</span>
      </div>

      {/* Card */}
      <div
        className="flashcard-scene w-full cursor-pointer select-none"
        onClick={handleFlip}
        style={{ minHeight: "16rem" }}
      >
        <div className={`flashcard-inner ${isFlipped ? "is-flipped" : ""}`} style={{ minHeight: "16rem" }}>

          {/* Front */}
          <div className="flashcard-face rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-white/[0.03] shadow-lg shadow-black/5 dark:shadow-none flex flex-col items-center justify-center gap-4 px-8 py-10" style={{ position: "relative" }}>
            <p className="text-3xl font-semibold text-indigo-500 dark:text-indigo-400 text-center leading-snug">
              &ldquo;{currentCard.phrase}&rdquo;
            </p>
            <p className="text-[11px] text-[#86868b] mt-2">Tap to reveal</p>
          </div>

          {/* Back */}
          <div className="flashcard-face flashcard-face--back rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-white/[0.03] shadow-lg shadow-black/5 dark:shadow-none flex flex-col justify-center gap-3 px-8 py-8">
            <p className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-center leading-snug">
              {currentCard.gloss}
            </p>
            {currentCard.note && (
              <p className="text-sm text-[#86868b] text-center">{currentCard.note}</p>
            )}
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center text-[10px] font-medium text-[#86868b] bg-black/5 dark:bg-white/5 rounded-full px-2.5 py-0.5">
                {currentCard.detectedLanguage}
              </span>
              <span className="inline-flex items-center text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/8 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-full px-2.5 py-0.5">
                {currentCard.detectedRegion.split(",")[0].trim()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons — visible only after flip */}
      <div className={`flex gap-3 w-full transition-all duration-300 ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
        <button
          onClick={(e) => { e.stopPropagation(); handleStillLearning(); }}
          className="flex-1 py-3 rounded-xl border border-black/[0.08] dark:border-white/[0.08] text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all"
        >
          Still learning ↩
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleGotIt(); }}
          className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-all"
        >
          Got it ✓
        </button>
      </div>
    </div>
  );
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
