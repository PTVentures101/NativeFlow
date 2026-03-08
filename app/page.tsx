"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { SmartBar } from "@/components/SmartBar";
import { LocationBar } from "@/components/LocationBar";
import { SourceLanguagePicker } from "@/components/SourceLanguagePicker";
import { ResultCard, type AnalysisResult } from "@/components/ResultCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useSourceLanguageContext } from "@/contexts/SourceLanguageContext";

type AppState = "idle" | "loading" | "result" | "error";

const EXAMPLES = [
  'Is "dos cervezas porfa" natural for casual Spanish in Málaga?',
  'Would "c\'est trop stylé" sound natural from a young person in Lyon?',
  'Does "ich hab keine Ahnung" work in a Munich office?',
  'Is "fare una passeggiata stasera?" natural in Naples?',
];

export default function Home() {
  const { sourceLang } = useSourceLanguageContext();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [appState, setAppState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(async () => {
    const trimmed = query.trim();
    if (trimmed.length < 5) return;
    setAppState("loading");
    setResult(null);
    setErrorMessage("");
    setSubmittedQuery(trimmed);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, location: location.trim(), sourceLang }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.error ?? "Something went wrong."); setAppState("error"); return; }
      setResult(data as AnalysisResult);
      setAppState("result");
    } catch {
      setErrorMessage("Network error. Check your connection and try again.");
      setAppState("error");
    }
  }, [query, location]);

  const reset = () => { setQuery(""); setAppState("idle"); setResult(null); setErrorMessage(""); setLocation(""); setSubmittedQuery(""); };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#09090b] relative">
      <Header />

      <main className="max-w-2xl mx-auto px-5 pt-28 pb-24 relative z-10">

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="mb-9 text-center">
          <h1 className="text-[2.5rem] sm:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
            Sound like a Native,
            <br />
            <span className="text-indigo-500">every time.</span>
          </h1>
          <p className="text-sm text-[#6c6c70] dark:text-[#6c6c70] max-w-sm mx-auto leading-relaxed font-light">
            Any phrase. Any language. Real-time verdict with the regional nuance textbooks miss.
          </p>
        </div>

        {/* ── Location + Smart Bar ──────────────────────────── */}
        <div className="mb-4 flex flex-col gap-2">
          <LocationBar value={location} onChange={setLocation} />
          <SourceLanguagePicker />
          <SmartBar value={query} onChange={setQuery} onSubmit={handleSubmit} isLoading={appState === "loading"} />
        </div>

        {/* ── Examples ──────────────────────────────────────── */}
        {appState === "idle" && (
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-widest text-[#86868b] mb-3 font-semibold">
              Try an example
            </p>
            <div className="flex flex-col gap-1">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setQuery(ex); setAppState("idle"); }}
                  className="text-left text-xs text-[#6c6c70] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors leading-relaxed py-0.5"
                >
                  ›&nbsp;&nbsp;{ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── States ────────────────────────────────────────── */}
        {appState === "loading" && <LoadingSkeleton />}

        {appState === "result" && result && (
          <>
            <ResultCard result={result} originalQuery={submittedQuery} sourceLang={sourceLang} />
            <div className="mt-5 flex justify-center">
              <button onClick={reset} className="text-xs text-[#86868b] hover:text-indigo-500 transition-colors">
                ← Check another phrase
              </button>
            </div>
          </>
        )}

        {appState === "error" && (
          <div className="rounded-2xl border border-rose-500/15 bg-rose-500/[0.04] dark:bg-rose-500/[0.06] px-5 py-4">
            <p className="text-sm text-rose-600 dark:text-rose-400 leading-relaxed">{errorMessage}</p>
            <button onClick={reset} className="mt-3 text-xs text-[#86868b] hover:text-amber-500 transition-colors">
              ← Try again
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 hidden sm:block border-t border-black/[0.06] dark:border-white/[0.06] bg-[#f5f5f7]/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-5 h-10 flex items-center justify-between">
          <span className="text-[11px] text-[#86868b]">Free · 10 checks / day</span>
          <span className="text-[11px] text-[#86868b]">Gemini 2.5 Flash</span>
        </div>
      </footer>
    </div>
  );
}
