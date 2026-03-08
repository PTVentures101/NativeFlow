/**
 * Audio Mode — ElevenLabs TTS client
 *
 * Uses the eleven_multilingual_v2 model with a single consistent voice (Adam)
 * that speaks any language naturally. Results are cached in-memory by phrase.
 */

export interface TTSOptions {
  text: string;
  detectedRegion: string;
  detectedLanguage: string;
}

// Adam — a clear, neutral voice that works well across all languages
// with the eleven_multilingual_v2 model
const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB";

// Server-side in-memory cache: voiceId::text → ArrayBuffer
const cache = new Map<string, ArrayBuffer>();

export function getVoiceForRegion(_language: string): string {
  return DEFAULT_VOICE_ID;
}

export async function synthesizeSpeech(options: TTSOptions): Promise<ArrayBuffer> {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured.");
  }

  const voiceId = getVoiceForRegion(options.detectedLanguage);
  const cacheKey = `${voiceId}::${options.text}`;

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
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
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
