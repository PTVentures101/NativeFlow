"use client";

interface LocationBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationBar({ value, onChange }: LocationBarProps) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none transition-all duration-200 focus-within:border-indigo-400/60 dark:focus-within:border-indigo-400/40 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]">
      {/* Pin icon */}
      <svg
        className="shrink-0 text-[#86868b]"
        width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Native location — city or region"
        maxLength={80}
        spellCheck={false}
        className="
          flex-1 bg-transparent text-xs leading-none
          text-[#1d1d1f] dark:text-[#f5f5f7]
          placeholder-[#86868b] dark:placeholder-[#6c6c70]
          focus:outline-none
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear location"
          className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-black/8 dark:bg-white/10 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
        >
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}
