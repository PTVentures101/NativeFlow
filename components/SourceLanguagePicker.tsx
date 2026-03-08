"use client";

import { useState, useRef, useEffect } from "react";
import { SOURCE_LANGUAGES } from "@/hooks/useSourceLanguage";
import { useSourceLanguageContext } from "@/contexts/SourceLanguageContext";

export function SourceLanguagePicker() {
  const { sourceLang, setSourceLang } = useSourceLanguageContext();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isNonDefault = sourceLang !== "English";

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors rounded-lg px-2 py-1 -mx-2
          ${isNonDefault
            ? "text-indigo-500 dark:text-indigo-400 bg-indigo-500/[0.06] hover:bg-indigo-500/[0.1]"
            : "text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400"
          }`}
      >
        <GlobeIcon />
        <span>Explain in</span>
        <span className={`font-semibold ${isNonDefault ? "" : "text-[#1d1d1f] dark:text-[#f5f5f7]"}`}>
          {sourceLang}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] shadow-xl shadow-black/[0.12] dark:shadow-black/40 py-1.5 overflow-hidden">
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#86868b]">
            Explanation language
          </p>
          {SOURCE_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => { setSourceLang(lang); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between gap-2 transition-colors
                ${lang === sourceLang
                  ? "text-indigo-500 dark:text-indigo-400 bg-indigo-500/[0.06]"
                  : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                }`}
            >
              <span>{lang}</span>
              <span className="flex items-center gap-1.5 shrink-0">
                {lang === sourceLang && <CheckIcon />}
                {lang !== "English" && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 rounded px-1 py-0.5 leading-none">
                    Pro
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
