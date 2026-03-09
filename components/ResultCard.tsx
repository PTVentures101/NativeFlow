"use client";

import { DeepDive } from "./DeepDive";
import { PhrasesPanel } from "./PhrasesPanel";
import { SaveButton } from "./SaveButton";
import { useAudio } from "@/hooks/useAudio";
import { SpeakerIcon, StopIcon } from "./icons";

export interface AnalysisResult {
  queryType?: "check" | "translate";
  isNatural: boolean;
  detectedLanguage: string;
  detectedRegion: string;
  correction: string;
  explanation: string;
  deepDive: string[];
}

export function ResultCard({ result, originalQuery, sourceLang = "English" }: { result: AnalysisResult; originalQuery: string; sourceLang?: string }) {
  const { queryType = "check", isNatural, detectedLanguage, detectedRegion, correction, explanation, deepDive } = result;
  const isTranslate = queryType === "translate";

  const { play, stop, isPlaying } = useAudio();

  const handleAudio = () => {
    if (isPlaying) {
      stop();
    } else {
      play(correction, detectedLanguage, detectedRegion);
    }
  };

  return (
    <div className="animate-fade-up rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-white/[0.03] overflow-hidden shadow-lg shadow-black/5 dark:shadow-none">
      {/* Coloured top accent stripe */}
      <div className={`h-[3px] ${isTranslate ? "bg-gradient-to-r from-indigo-500 to-violet-400" : isNatural ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-rose-400 to-pink-400"}`} />

      {/* ── Verdict row (check queries only) ────────────────── */}
      {!isTranslate && (
        <div className={`px-5 py-3.5 flex items-center justify-between border-b ${
          isNatural
            ? "border-emerald-500/20 bg-emerald-500/[0.08] dark:bg-emerald-500/[0.10]"
            : "border-rose-500/20 bg-rose-500/[0.08] dark:bg-rose-500/[0.10]"
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full ${
              isNatural ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"
            }`}>
              {isNatural ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              )}
            </span>
            <span className={`text-sm font-semibold animate-verdict-in ${isNatural ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {isNatural ? "Sounds Native" : "Sounds Non-Native"}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{detectedRegion}</p>
            <p className="text-[10px] text-[#86868b] mt-0.5">{detectedLanguage}</p>
          </div>
        </div>
      )}

      {/* ── Translate header (translate queries only) ────────── */}
      {isTranslate && (
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-indigo-500/20 bg-indigo-500/[0.08] dark:bg-indigo-500/[0.10]">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-500">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </span>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Here&apos;s how locals say it
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{detectedRegion}</p>
            <p className="text-[10px] text-[#86868b] mt-0.5">{detectedLanguage}</p>
          </div>
        </div>
      )}

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-3">

        {/* Native version + audio */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-[#86868b] mb-2">
              Say it like this
            </p>
            <p className="text-2xl font-semibold text-indigo-500 dark:text-indigo-400 leading-snug">
              &ldquo;{correction}&rdquo;
            </p>
          </div>

          {/* Audio + Save buttons */}
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={handleAudio}
              title={isPlaying ? "Stop" : "Play pronunciation"}
              className={`
                shrink-0 flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200
                ${isPlaying
                  ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/25"
                  : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/50"
                }
              `}
            >
              {isPlaying ? <StopIcon /> : <SpeakerIcon />}
            </button>
            <SaveButton
              size="md"
              payload={{
                phrase: correction,
                gloss: explanation,
                note: "",
                detectedLanguage,
                detectedRegion,
                sourceQuery: originalQuery,
              }}
            />
          </div>
        </div>

        {/* Quick Take */}
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#86868b] mb-2">
          Quick Take
        </p>
        <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed mb-4">
          {explanation}
        </p>

        {/* Deep Dive */}
        <DeepDive
          bullets={Array.isArray(deepDive) ? deepDive : [deepDive]}
          detectedRegion={detectedRegion}
          detectedLanguage={detectedLanguage}
        />

        {/* Phrases */}
        <PhrasesPanel
          originalQuery={originalQuery}
          correction={correction}
          detectedLanguage={detectedLanguage}
          detectedRegion={detectedRegion}
          sourceLang={sourceLang}
        />
      </div>
    </div>
  );
}

