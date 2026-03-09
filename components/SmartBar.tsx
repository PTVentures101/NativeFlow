"use client";

import { useRef, useEffect, KeyboardEvent, useCallback } from "react";
import { useSpeechInput } from "@/hooks/useSpeechInput";

interface SmartBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function SmartBar({ value, onChange, onSubmit, isLoading }: SmartBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSpeechResult = useCallback((transcript: string) => {
    onChange(transcript);
  }, [onChange]);

  const { isListening, toggle: toggleMic } = useSpeechInput({ onResult: handleSpeechResult });

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  const canSubmit = value.trim().length >= 5 && !isLoading;

  return (
    <div
      className={`
        relative rounded-2xl border transition-all duration-200
        bg-white dark:bg-white/[0.04]
        border-black/[0.08] dark:border-white/[0.08]
        shadow-sm dark:shadow-none
        ${canSubmit || isLoading ? "focus-within:border-indigo-400/60 dark:focus-within:border-indigo-400/40 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" : ""}
      `}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder="Type a phrase in any language, or ask how to say something..."
        rows={2}
        maxLength={600}
        spellCheck={false}
        className="
          w-full resize-none bg-transparent px-4 pt-4 pb-2
          text-sm leading-relaxed font-normal
          text-[#1d1d1f] dark:text-[#f5f5f7]
          placeholder-[#86868b] dark:placeholder-[#6c6c70]
          focus:outline-none disabled:cursor-not-allowed
          min-h-[76px] max-h-[200px] overflow-y-auto
        "
      />

      <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
        <span className="text-[11px] text-[#86868b] select-none pl-1">
          {value.length > 0 ? `${value.length} / 600` : ""}
        </span>

        <div className="flex items-center gap-2">
          {/* Mic button */}
          <button
            type="button"
            onClick={toggleMic}
            title={isListening ? "Stop listening" : "Speak your question"}
            className={`
              flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
              ${isListening
                ? "bg-red-500 text-white animate-mic-ring"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/8"
              }
            `}
          >
            {isListening ? <StopIcon /> : <MicIcon />}
          </button>

          {/* Submit button */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`
              flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold
              transition-all duration-150 select-none
              ${canSubmit
                ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-sm active:scale-95"
                : "bg-black/5 dark:bg-white/5 text-[#86868b] cursor-not-allowed"
              }
            `}
          >
            {isLoading ? <><Spinner /> Analysing</> : <>Check <ArrowIcon /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}
