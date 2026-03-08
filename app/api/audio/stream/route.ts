/**
 * Audio Mode — WebSocket streaming endpoint (Sprint 2 scaffold)
 *
 * This route will handle real-time Speech-to-Speech (S2S) audio:
 *   1. Client opens WebSocket connection
 *   2. Client streams raw PCM audio chunks (STT via Web Speech API or Whisper)
 *   3. Server sends transcription → Gemini → ElevenLabs TTS
 *   4. Server streams audio chunks back to client
 *
 * Target latency: < 500ms end-to-end
 *
 * Note: Next.js does not natively support WebSockets in route handlers.
 * Sprint 2 will add a lightweight ws server (or use Vercel's WebSocket support).
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "WebSocket endpoint scaffolded. Full implementation in Sprint 2.",
      protocol: "ws://",
      status: "not_implemented",
    },
    { status: 501 }
  );
}
