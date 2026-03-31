"use client";

import { useState, useCallback } from "react";
import type { SituationalPhrase } from "@/lib/get-phrases";
import { speakText, stopAllAudio } from "@/hooks/useAudio";
import { SaveButton } from "./SaveButton";
import { SpeakerIcon, StopIcon } from "./icons";

interface GetPhrasesResultProps {
  phrases: SituationalPhrase[];
  languageContext: string;
  situation: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function GetPhrasesResult({
  phrases,
  languageContext,
  situation,
  onLoadMore,
  isLoadingMore,
}: GetPhrasesResultProps) {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  const handlePlay = useCallback(
    (phrase: SituationalPhrase, idx: number) => {
      if (playingIdx === idx) {
        stopAllAudio();
        setPlayingIdx(null);
        return;
      }
      speakText(
        phrase.phrase,
        languageContext,
        undefined,
        () => setPlayingIdx(idx),
        () => setPlayingIdx(null)
      );
    },
    [playingIdx, languageContext]
  );

  return (
    <div>
      {/* Header badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {languageContext && (
          <span className="inline-flex items-center text-[10px] font-medium text-[#86868b] bg-black/5 dark:bg-white/5 rounded-full px-2.5 py-0.5">
            {languageContext}
          </span>
        )}
        <span className="inline-flex items-center text-[10px] font-medium text-[#86868b] bg-black/5 dark:bg-white/5 rounded-full px-2.5 py-0.5">
          {phrases.length} phrases
        </span>
      </div>

      {/* Phrase list */}
      <ul className="space-y-2" key={phrases.length}>
        {phrases.map((p, i) => (
          <li
            key={i}
            className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] px-3.5 py-3"
          >
            {/* Category chip */}
            {p.category && (
              <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded px-2 py-0.5 mb-2 leading-none">
                {p.category}
              </span>
            )}
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug">
                  {p.phrase}
                </p>
                <p className="text-xs text-[#86868b] mt-0.5 leading-snug">
                  {p.gloss}
                  {p.note && (
                    <span className="text-[#86868b]/70"> · {p.note}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handlePlay(p, i)}
                  title={playingIdx === i ? "Stop" : "Play"}
                  className={`
                    flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200
                    ${
                      playingIdx === i
                        ? "bg-indigo-500 border-indigo-500 text-white"
                        : "border-black/[0.08] dark:border-white/[0.08] text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/50"
                    }
                  `}
                >
                  {playingIdx === i ? <StopIcon size={9} /> : <SpeakerIcon size={11} />}
                </button>
                <SaveButton
                  size="sm"
                  payload={{
                    phrase: p.phrase,
                    gloss: p.gloss,
                    note: p.note,
                    detectedLanguage: languageContext,
                    detectedRegion: languageContext,
                    sourceQuery: situation,
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {onLoadMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-sm active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <MoreSpinner />
                Loading more…
              </>
            ) : (
              "More phrases"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function MoreSpinner() {
  return (
    <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}
