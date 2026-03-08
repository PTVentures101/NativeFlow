import { NextRequest, NextResponse } from "next/server";
import { getSituationalPhrases } from "@/lib/phrases";

export async function POST(request: NextRequest) {
  let query: string;
  let detectedLanguage: string;
  let detectedRegion: string;
  let correction: string;
  let sourceLang: string;

  try {
    const body = await request.json();
    query = (body.query ?? "").trim();
    detectedLanguage = (body.detectedLanguage ?? "").trim();
    detectedRegion = (body.detectedRegion ?? "").trim();
    correction = (body.correction ?? "").trim();
    sourceLang = (body.sourceLang ?? "English").trim();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }

  if (!query || !detectedLanguage) {
    return NextResponse.json(
      { error: "Missing required fields.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }

  try {
    const result = await getSituationalPhrases(query, detectedLanguage, detectedRegion, correction, sourceLang);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/phrases] Error:", error);
    return NextResponse.json(
      { error: "Failed to load phrases. Please try again.", code: "PHRASES_FAILED" },
      { status: 500 }
    );
  }
}
