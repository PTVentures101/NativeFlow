import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/audio";

export async function POST(request: NextRequest) {
  let text: string;
  let language: string;
  let region: string;

  try {
    const body = await request.json();
    text = (body.text ?? "").trim();
    language = (body.language ?? "").trim();
    region = (body.region ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!text || text.length > 500) {
    return NextResponse.json({ error: "Invalid text." }, { status: 400 });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "TTS not configured." }, { status: 503 });
  }

  try {
    const buffer = await synthesizeSpeech({ text, detectedLanguage: language, detectedRegion: region });
    return new NextResponse(buffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("[/api/audio] Error:", error);
    return NextResponse.json({ error: "TTS failed." }, { status: 500 });
  }
}
