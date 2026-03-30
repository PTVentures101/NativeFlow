import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSituationPhrases } from "@/lib/get-phrases";
import { getIp, rateLimit } from "@/lib/rate-limit";
import { getUserTier } from "@/lib/tier";

export async function POST(request: NextRequest) {
  // ── Tier check — Pro users bypass rate limiting ────────────────────────────
  const { userId } = await auth();
  const tier = await getUserTier(userId ?? null);
  const isPro = tier === "pro";

  let rateLimitHeaders: Record<string, string> = {};

  if (!isPro) {
    const ip = getIp(request);
    const { success, remaining, limit } = await rateLimit(ip);
    rateLimitHeaders = {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
    };

    if (!success) {
      return NextResponse.json(
        {
          error:
            "You've reached the free daily limit of 10 checks. Upgrade to Pro for unlimited access.",
          code: "RATE_LIMITED",
        },
        { status: 429, headers: { ...rateLimitHeaders, "X-RateLimit-Remaining": "0" } }
      );
    }
  }

  // ── Parse & validate ───────────────────────────────────────────────────────
  let situation: string;
  let targetLanguage: string;
  let location: string;
  let sourceLang: string;
  let excludePhrases: string[];

  try {
    const body = await request.json();
    situation = (body.situation ?? "").trim();
    targetLanguage = (body.targetLanguage ?? "").trim();
    location = (body.location ?? "").trim();
    sourceLang = (body.sourceLang ?? "English").trim();
    excludePhrases = Array.isArray(body.excludePhrases) ? body.excludePhrases.map(String) : [];
  } catch {
    return NextResponse.json(
      { error: "Invalid request body.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }

  if (!situation) {
    return NextResponse.json(
      { error: "A situation is required.", code: "MISSING_SITUATION" },
      { status: 400 }
    );
  }

  if (situation.length < 10) {
    return NextResponse.json(
      { error: "Add a bit more detail to the situation.", code: "SITUATION_TOO_SHORT" },
      { status: 400 }
    );
  }

  if (situation.length > 500) {
    return NextResponse.json(
      { error: "Situation is too long (max 500 characters).", code: "SITUATION_TOO_LONG" },
      { status: 400 }
    );
  }

  if (!targetLanguage) {
    return NextResponse.json(
      { error: "Please select a target language.", code: "MISSING_LANGUAGE" },
      { status: 400 }
    );
  }

  try {
    const phrases = await getSituationPhrases(
      situation,
      targetLanguage,
      location,
      sourceLang,
      excludePhrases
    );
    return NextResponse.json({ phrases }, { headers: rateLimitHeaders });
  } catch (error) {
    console.error("[/api/get-phrases] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate phrases. Please try again.", code: "PHRASES_FAILED" },
      { status: 500 }
    );
  }
}
