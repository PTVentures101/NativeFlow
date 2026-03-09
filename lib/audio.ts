/**
 * Audio Mode — ElevenLabs TTS client
 *
 * Uses the eleven_multilingual_v2 model with a single consistent voice (Sarah)
 * that speaks any language naturally. Results are cached in-memory by phrase.
 */

export interface TTSOptions {
  text: string;
  detectedRegion: string;
  detectedLanguage: string;
}

// Sarah — neutral voice, works well across languages with eleven_multilingual_v2
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

// ISO 639-1 codes for ElevenLabs language_code param
const LANG_CODE: Record<string, string> = {
  spanish: "es", french: "fr", german: "de", italian: "it",
  portuguese: "pt", "brazilian portuguese": "pt", japanese: "ja",
  mandarin: "zh", "mandarin chinese": "zh", cantonese: "zh",
  korean: "ko", arabic: "ar", russian: "ru", dutch: "nl",
  polish: "pl", turkish: "tr", hindi: "hi", catalan: "ca",
  greek: "el", swedish: "sv", norwegian: "nb", danish: "da",
  finnish: "fi", czech: "cs", romanian: "ro", hungarian: "hu",
  thai: "th", vietnamese: "vi", indonesian: "id", malay: "ms",
  hebrew: "he", ukrainian: "uk",
};

function getLanguageCode(language: string): string {
  return LANG_CODE[language.toLowerCase()] ?? "en";
}

// Server-side in-memory cache: voiceId::langCode::text → ArrayBuffer
const cache = new Map<string, ArrayBuffer>();

export function getVoiceForRegion(_language: string): string {
  return DEFAULT_VOICE_ID;
}

export async function synthesizeSpeech(options: TTSOptions): Promise<ArrayBuffer> {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured.");
  }

  const voiceId = getVoiceForRegion(options.detectedLanguage);
  const langCode = getLanguageCode(options.detectedLanguage);
  const cacheKey = `${voiceId}::${langCode}::${options.text}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: options.text,
        model_id: "eleven_multilingual_v2",
        language_code: langCode,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
          style: 0,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs error ${res.status}: ${body}`);
  }

  const buffer = await res.arrayBuffer();
  cache.set(cacheKey, buffer);
  return buffer;
}
