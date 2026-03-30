"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { SituationalPhrase } from "@/lib/get-phrases";
import { SOURCE_LANGUAGES } from "@/hooks/useSourceLanguage";
import { useSourceLanguageContext } from "@/contexts/SourceLanguageContext";
import { GetPhrasesResult } from "./GetPhrasesResult";
import { QueryInput } from "@/components/QueryInput";

// All languages except English — user wants phrases *in* a foreign language
const TARGET_LANGUAGES = SOURCE_LANGUAGES.filter((l) => l !== "English");

const EXAMPLES: { label: string; situation: string; language: string; location: string }[] = [
  { label: "Going to a bar in Málaga with friends", situation: "Going to a bar in Málaga with friends", language: "Spanish", location: "Málaga" },
  { label: "Ordering food at a market in Mexico City", situation: "Ordering food at a market in Mexico City", language: "Spanish", location: "Mexico City" },
  { label: "My French-speaking neighbour pops round", situation: "My French-speaking neighbour pops round unexpectedly", language: "French", location: "" },
  { label: "Having dinner at a restaurant in Tokyo", situation: "Having dinner at a restaurant in Tokyo", language: "Japanese", location: "Tokyo" },
];

type TabState = "idle" | "loading" | "result" | "error";

interface GetPhrasesTabProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export function GetPhrasesTab({ location, onLocationChange }: GetPhrasesTabProps) {
  const { sourceLang } = useSourceLanguageContext();
  const [situation, setSituation] = useState("");
  const [targetLanguage, setTargetLanguage] = useState<string>("Spanish");
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
          targetLanguage,
          location: location.trim(),
          sourceLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong.");
        setTabState("error");
        return;
      }
      setPhrases(data.phrases as SituationalPhrase[]);
      setTabState("result");
    } catch {
      setErrorMessage("Network error. Check your connection and try again.");
      setTabState("error");
    }
  }, [situation, targetLanguage, location, sourceLang, tabState]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch("/api/get-phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: submittedSituation,
          targetLanguage,
          location: location.trim(),
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
  }, [isLoadingMore, submittedSituation, targetLanguage, location, sourceLang, phrases]);

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
        <TargetLanguagePicker value={targetLanguage} onChange={setTargetLanguage} />

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
          <p className="text-[10px] uppercase tracking-widest text-[#86868b] mb-3 font-semibold">
            Try an example
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => { setSituation(ex.situation); setTargetLanguage(ex.language); if (ex.location) onLocationChange(ex.location); }}
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
            targetLanguage={targetLanguage}
            location={location}
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
    </div>
  );
}

// ── Target language picker ────────────────────────────────────────────────────

interface TargetLanguagePickerProps {
  value: string;
  onChange: (lang: string) => void;
}

function TargetLanguagePicker({ value, onChange }: TargetLanguagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none transition-all duration-200 hover:border-indigo-400/60 dark:hover:border-indigo-400/40"
      >
        <span className="shrink-0 text-[#86868b]"><GlobeIcon /></span>
        <span className="flex-1 text-left text-xs text-[#1d1d1f] dark:text-[#f5f5f7]">{value}</span>
        <span className="text-[#86868b]"><ChevronIcon open={isOpen} /></span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] shadow-xl shadow-black/[0.12] dark:shadow-black/40 py-1.5 overflow-hidden max-h-64 overflow-y-auto">
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#86868b]">
            Language
          </p>
          {TARGET_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                onChange(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between gap-2 transition-colors
                ${
                  lang === value
                    ? "text-indigo-500 dark:text-indigo-400 bg-indigo-500/[0.06]"
                    : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                }`}
            >
              {lang}
              {lang === value && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
