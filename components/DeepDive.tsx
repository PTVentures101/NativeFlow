"use client";

import { useState, useRef, useEffect } from "react";

interface DeepDiveProps {
  bullets: string[];
  detectedRegion: string;
  detectedLanguage: string;
}

const CATEGORY_ORDER = ["Tone", "Vocab", "Pronunciation", "Native Touch", "Etymology"];

export function DeepDive({ bullets, detectedRegion, detectedLanguage }: DeepDiveProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.scrollHeight);
  }, [bullets]);

  return (
    <div className="mt-1">
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-full flex items-center gap-3 py-3 group"
      >
        <div className="flex-1 h-px bg-black/8 dark:bg-white/8 group-hover:bg-indigo-400/40 transition-colors" />
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-[#86868b] group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap select-none">
          Deep Dive
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
        <div className="flex-1 h-px bg-black/8 dark:bg-white/8 group-hover:bg-indigo-400/40 transition-colors" />
      </button>

      <div style={{ height: isOpen ? `${height}px` : "0px", overflow: "hidden", transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        <div ref={contentRef} className="pb-2">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/8 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-full px-2.5 py-0.5">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {detectedRegion.split(",")[0].trim()}
            </span>
            <span className="inline-flex items-center text-[10px] font-medium text-[#86868b] bg-black/5 dark:bg-white/5 rounded-full px-2.5 py-0.5">
              {detectedLanguage}
            </span>
          </div>

          {/* Bullet list */}
          <ul className="space-y-2">
            {[...bullets].sort((a, b) => {
              const iA = CATEGORY_ORDER.indexOf(a.split(":")[0].trim());
              const iB = CATEGORY_ORDER.indexOf(b.split(":")[0].trim());
              return (iA === -1 ? 99 : iA) - (iB === -1 ? 99 : iB);
            }).map((bullet, i) => {
              const colonIdx = bullet.indexOf(":");
              const keyword = colonIdx > -1 ? bullet.slice(0, colonIdx) : null;
              const body = colonIdx > -1 ? bullet.slice(colonIdx + 1).trim() : bullet;
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-indigo-400/70 shrink-0" />
                  <span className="text-[#3d3d3f] dark:text-[#aeaeb2]">
                    {keyword && (
                      <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {keyword}:{" "}
                      </span>
                    )}
                    {body}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
