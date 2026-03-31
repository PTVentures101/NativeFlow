"use client";

import { useState, useCallback } from "react";
import type { SituationalPhrase } from "@/lib/get-phrases";
import { useSourceLanguageContext } from "@/contexts/SourceLanguageContext";
import { GetPhrasesResult } from "./GetPhrasesResult";
import { QueryInput } from "@/components/QueryInput";
import { UpgradePrompt } from "@/components/UpgradePrompt";

const EXAMPLES: { label: string; situation: string; languageContext: string }[] = [
  { label: "Going to a bar in Málaga with friends", situation: "Going to a bar in Málaga with friends", languageContext: "Spanish in Málaga" },
  { label: "Ordering food at a market in Mexico City", situation: "Ordering food at a market in Mexico City", languageContext: "Spanish in Mexico City" },
  { label: "My French-speaking neighbour pops round", situation: "My French-speaking neighbour pops round unexpectedly", languageContext: "French" },
  { label: "Having dinner at a restaurant in Tokyo", situation: "Having dinner at a restaurant in Tokyo", languageContext: "Japanese in Tokyo" },
];

type TabState = "idle" | "loading" | "result" | "error";

interface GetPhrasesTabProps {
  usageCount: number;
  dailyLimit: number;
  isPro: boolean;
  onUsageIncrement: () => void;
}

export function GetPhrasesTab({ usageCount, dailyLimit, isPro, onUsageIncrement }: GetPhrasesTabProps) {
  const { sourceLang } = useSourceLanguageContext();
  const [situation, setSituation] = useState("");
  const [languageContext, setLanguageContext] = useState("");
  const [tabState, setTabState] = useState<TabState>("idle");
  const [phrases, setPhrases] = useState<SituationalPhrase[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedSituation, setSubmittedSituation] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleSubmit = useCallback(async () => {
    const trimmed = situation.trim();
    if (trimmed.length < 10 || tabState === "loading") return;
    setTabState("loading");
    setPhrases([]);
    setErrorMessage("");
    setSubmittedSituation(trimmed);
    try {
      const res = await fetch("/api/get-phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: trimmed,
          languageContext: languageContext.trim(),
          sourceLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong.");
        setTabState("error");
        return;
      }
      if (!isPro) onUsageIncrement();
      setPhrases(data.phrases as SituationalPhrase[]);
      setTabState("result");
    } catch {
      setErrorMessage("Network error. Check your connection and try again.");
      setTabState("error");
    }
  }, [situation, languageContext, sourceLang, tabState, isPro, onUsageIncrement]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch("/api/get-phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: submittedSituation,
          languageContext: languageContext.trim(),
          sourceLang,
          excludePhrases: phrases.map((p) => p.phrase),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPhrases((prev) => [...prev, ...(data.phrases as SituationalPhrase[])]);
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, submittedSituation, languageContext, sourceLang, phrases]);

  const reset = () => {
    setSituation("");
    setTabState("idle");
    setPhrases([]);
    setErrorMessage("");
    setSubmittedSituation("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input area — always visible so switching tabs doesn't lose the form */}
      <div className={`flex flex-col gap-2 ${tabState === "result" ? "hidden" : ""}`}>
        {/* Language and location input */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none transition-all duration-200 focus-within:border-indigo-400/60 dark:focus-within:border-indigo-400/40 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]">
          <span className="shrink-0 text-[#86868b]"><GlobeIcon /></span>
          <input
            type="text"
            value={languageContext}
            onChange={(e) => setLanguageContext(e.target.value)}
            placeholder="Language and Location (e.g. Spanish in Málaga)"
            maxLength={80}
            spellCheck={false}
            className="flex-1 bg-transparent text-sm leading-none text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#6c6c70] focus:outline-none"
          />
          {languageContext && (
            <button
              onClick={() => setLanguageContext("")}
              aria-label="Clear language and location"
              className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-black/[0.08] dark:bg-white/10 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
            >
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <QueryInput
          value={situation}
          onChange={setSituation}
          onSubmit={handleSubmit}
          isLoading={tabState === "loading"}
          placeholder="Describe a situation…"
          submitLabel="Get Phrases"
          loadingLabel="Generating…"
          minLength={10}
          maxLength={500}
          showMic
        />
      </div>

      {/* Examples */}
      {tabState === "idle" && (
        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3 font-semibold">
            Try an example
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => { setSituation(ex.situation); setLanguageContext(ex.languageContext); }}
                className="text-left text-xs font-medium px-3 py-1.5 rounded-full border transition-colors leading-relaxed border-black/[0.10] bg-black/[0.03] dark:border-white/[0.10] dark:bg-white/[0.03] text-[#6c6c70] dark:text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/30 hover:bg-indigo-500/[0.04]"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {tabState === "loading" && (
        <div className="space-y-2.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-black/[0.04] dark:bg-white/[0.04] h-[72px]"
              style={{ opacity: 1 - i * 0.1 }}
            />
          ))}
        </div>
      )}

      {/* Result */}
      {tabState === "result" && phrases.length > 0 && (
        <>
          <GetPhrasesResult
            phrases={phrases}
            languageContext={languageContext}
            situation={submittedSituation}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
          />
          <div className="flex justify-center">
            <button
              onClick={reset}
              className="text-xs text-[#86868b] hover:text-indigo-500 transition-colors"
            >
              ← Try another situation
            </button>
          </div>
        </>
      )}

      {/* Error */}
      {tabState === "error" && (
        <div className="rounded-2xl border border-rose-500/15 bg-rose-500/[0.04] dark:bg-rose-500/[0.06] px-5 py-4">
          <p className="text-sm text-rose-600 dark:text-rose-400 leading-relaxed">
            {errorMessage}
          </p>
          <button
            onClick={reset}
            className="mt-3 text-xs text-[#86868b] hover:text-amber-500 transition-colors"
          >
            ← Try again
          </button>
        </div>
      )}

      {/* Upgrade prompt — shown near/at limit, hidden for Pro */}
      {!isPro && <UpgradePrompt usageCount={usageCount} dailyLimit={dailyLimit} />}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
