"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PhrasesResult, PhraseSuggestion } from "@/lib/phrases";
import { speakText, getLocale, stopAllAudio } from "@/hooks/useAudio";
import { SaveButton } from "./SaveButton";

interface PhrasesPanelProps {
  originalQuery: string;
  correction: string;
  detectedLanguage: string;
  detectedRegion: string;
  sourceLang?: string;
}

export function PhrasesPanel({ originalQuery, correction, detectedLanguage, detectedRegion, sourceLang = "English" }: PhrasesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PhrasesResult | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.scrollHeight);
  }, [result, isLoading, error]);

  const fetchPhrases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: originalQuery, correction, detectedLanguage, detectedRegion, sourceLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load phrases");
      setResult(data as PhrasesResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [originalQuery, correction, detectedLanguage, detectedRegion, sourceLang]);

  const handleToggle = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening && !hasFetched) {
      setHasFetched(true);
      fetchPhrases();
    }
  };

  const handlePlay = useCallback((phrase: PhraseSuggestion, idx: number) => {
    if (playingIdx === idx) {
      stopAllAudio();
      setPlayingIdx(null);
      return;
    }
    speakText(
      phrase.phrase,
      detectedLanguage,
      detectedRegion,
      () => setPlayingIdx(idx),
      () => setPlayingIdx(null)
    );
  }, [playingIdx, detectedLanguage, detectedRegion]);

  // Recalculate height when content changes
  useEffect(() => {
    if (contentRef.current && isOpen) {
      const newHeight = contentRef.current.scrollHeight;
      if (newHeight !== height) setHeight(newHeight);
    }
  });

  return (
    <div className="mt-0">
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 py-3 group"
      >
        <div className="flex-1 h-px bg-black/8 dark:bg-white/8 group-hover:bg-indigo-400/40 transition-colors" />
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#86868b] group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap select-none">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Phrases
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
        <div className="flex-1 h-px bg-black/8 dark:bg-white/8 group-hover:bg-indigo-400/40 transition-colors" />
      </button>

      <div style={{ height: isOpen ? `${height}px` : "0px", overflow: "hidden", transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        <div ref={contentRef} className="pb-3">

          {/* Loading */}
          {isLoading && (
            <div className="space-y-2.5 pt-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-black/[0.04] dark:bg-white/[0.04] h-14" style={{ opacity: 1 - i * 0.15 }} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex items-center justify-between rounded-xl border border-rose-500/15 bg-rose-500/[0.04] px-4 py-3">
              <p className="text-xs text-rose-500">{error}</p>
              <button
                onClick={fetchPhrases}
                className="text-[11px] text-[#86868b] hover:text-indigo-500 transition-colors ml-3 shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Phrases */}
          {result && !isLoading && (
            <>
              {/* Situation badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/8 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-full px-2.5 py-0.5">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {result.situation}
                </span>
                <span className="inline-flex items-center text-[10px] font-medium text-[#86868b] bg-black/5 dark:bg-white/5 rounded-full px-2.5 py-0.5">
                  {detectedRegion}
                </span>
              </div>

              {/* Phrase list */}
              <ul className="space-y-2">
                {result.phrases.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] px-3.5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug">
                        {p.phrase}
                      </p>
                      <p className="text-[11px] text-[#86868b] mt-0.5 leading-snug">
                        {p.gloss}
                        {p.note && (
                          <span className="text-[#86868b]/70"> · {p.note}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlay(p, i)}
                        title={playingIdx === i ? "Stop" : "Play"}
                        className={`
                          shrink-0 flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200
                          ${playingIdx === i
                            ? "bg-indigo-500 border-indigo-500 text-white"
                            : "border-black/[0.08] dark:border-white/[0.08] text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/50"
                          }
                        `}
                      >
                        {playingIdx === i ? <SmallStopIcon /> : <SmallSpeakerIcon />}
                      </button>
                      <SaveButton
                        size="sm"
                        payload={{
                          phrase: p.phrase,
                          gloss: p.gloss,
                          note: p.note,
                          detectedLanguage,
                          detectedRegion,
                          sourceQuery: originalQuery,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SmallSpeakerIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  );
}

function SmallStopIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  );
}
