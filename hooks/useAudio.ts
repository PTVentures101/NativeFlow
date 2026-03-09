"use client";

import { useState, useCallback } from "react";

// Language name (lowercase) → BCP-47 locale (used for Web Speech fallback)
const LANG_LOCALE: Record<string, string> = {
  "spanish": "es-ES",
  "french": "fr-FR",
  "german": "de-DE",
  "italian": "it-IT",
  "portuguese": "pt-PT",
  "brazilian portuguese": "pt-BR",
  "japanese": "ja-JP",
  "mandarin": "zh-CN",
  "mandarin chinese": "zh-CN",
  "cantonese": "zh-HK",
  "korean": "ko-KR",
  "arabic": "ar-SA",
  "russian": "ru-RU",
  "dutch": "nl-NL",
  "polish": "pl-PL",
  "turkish": "tr-TR",
  "hindi": "hi-IN",
  "catalan": "ca-ES",
  "greek": "el-GR",
  "swedish": "sv-SE",
  "norwegian": "nb-NO",
  "danish": "da-DK",
  "finnish": "fi-FI",
  "czech": "cs-CZ",
  "romanian": "ro-RO",
  "hungarian": "hu-HU",
  "thai": "th-TH",
  "vietnamese": "vi-VN",
  "indonesian": "id-ID",
  "malay": "ms-MY",
  "hebrew": "he-IL",
  "ukrainian": "uk-UA",
};

export function getLocale(language: string, region?: string): string {
  const lang = language.toLowerCase();
  const reg = (region ?? "").toLowerCase();

  if (lang.includes("portuguese") && (reg.includes("brazil") || reg.includes("brasil"))) return "pt-BR";
  if (lang.includes("spanish")) {
    if (reg.includes("mexico") || reg.includes("méxico")) return "es-MX";
    if (reg.includes("argentina")) return "es-AR";
    if (reg.includes("colombia")) return "es-CO";
  }
  if (lang.includes("chinese") || lang === "mandarin") {
    if (reg.includes("taiwan")) return "zh-TW";
    if (reg.includes("hong kong") || reg.includes("cantonese")) return "zh-HK";
  }

  return LANG_LOCALE[lang] ?? "en-US";
}

// ── Module-level audio state ─────────────────────────────────────────────────
// Tracks the currently playing ElevenLabs AudioBufferSourceNode so it can be
// stopped from anywhere (ResultCard stop button, PhrasesPanel switching phrases)

let currentSource: AudioBufferSourceNode | null = null;
let audioCtx: AudioContext | null = null;

export function stopAllAudio() {
  if (currentSource) {
    currentSource.onended = null; // Prevent stale onEnd callback from firing
    try { currentSource.stop(); } catch { /* already stopped */ }
    currentSource = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// ── ElevenLabs path ──────────────────────────────────────────────────────────

async function playViaElevenLabs(
  text: string,
  language: string,
  region: string | undefined,
  onStart: () => void,
  onEnd: () => void
): Promise<boolean> {
  try {
    // Create AudioContext synchronously — must happen within the user gesture call
    // stack before any await, otherwise iOS Safari blocks playback entirely.
    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioContext();
    }

    // Kick off resume + fetch in parallel — context is already unlocked above.
    const resumePromise = audioCtx.state === "suspended" ? audioCtx.resume() : Promise.resolve();
    const fetchPromise = fetch("/api/audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language, region }),
    });

    const [, res] = await Promise.all([resumePromise, fetchPromise]);

    if (!res.ok) {
      console.warn("[audio] ElevenLabs returned", res.status, "— falling back to Web Speech");
      return false;
    }

    const buffer = await res.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(buffer.slice(0));
    const source = audioCtx.createBufferSource();
    source.buffer = decoded;
    source.connect(audioCtx.destination);

    source.onended = onEnd;
    currentSource = source;

    onStart();
    source.start();
    return true;
  } catch (err) {
    console.warn("[audio] ElevenLabs failed:", err);
    return false;
  }
}

// ── Web Speech fallback ──────────────────────────────────────────────────────

function scoreVoice(voice: SpeechSynthesisVoice, locale: string): number {
  const langPrefix = locale.split("-")[0].toLowerCase();
  let score = 0;

  if (voice.lang.toLowerCase() === locale.toLowerCase()) score += 20;
  else if (voice.lang.toLowerCase().startsWith(langPrefix)) score += 10;
  else return -1;

  if (voice.name.includes("Enhanced")) score += 8;
  else if (voice.name.includes("Premium")) score += 7;
  else if (voice.name.includes("Neural")) score += 6;

  if (voice.localService) score += 3;

  return score;
}

async function getBestVoice(locale: string): Promise<SpeechSynthesisVoice | null> {
  let voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    await new Promise<void>((resolve) => {
      window.speechSynthesis.addEventListener("voiceschanged", () => resolve(), { once: true });
      setTimeout(resolve, 1000);
    });
    voices = window.speechSynthesis.getVoices();
  }
  const scored = voices
    .map((v) => ({ voice: v, score: scoreVoice(v, locale) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.voice ?? null;
}

async function playViaWebSpeech(
  text: string,
  language: string,
  region: string | undefined,
  onStart: () => void,
  onEnd: () => void
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const locale = getLocale(language, region);
  const voice = await getBestVoice(locale);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = 0.82;
  utterance.pitch = 1;
  if (voice) utterance.voice = voice;

  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;

  window.speechSynthesis.speak(utterance);
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function speakText(
  text: string,
  language: string,
  region: string | undefined,
  onStart: () => void,
  onEnd: () => void
) {
  stopAllAudio();

  // Try ElevenLabs first; fall back to Web Speech if unavailable or on error
  const usedElevenLabs = await playViaElevenLabs(text, language, region, onStart, onEnd);
  if (!usedElevenLabs) {
    await playViaWebSpeech(text, language, region, onStart, onEnd);
  }
}

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((text: string, language: string, region?: string) => {
    speakText(text, language, region, () => setIsPlaying(true), () => setIsPlaying(false));
  }, []);

  const stop = useCallback(() => {
    stopAllAudio();
    setIsPlaying(false);
  }, []);

  return { play, stop, isPlaying };
}
