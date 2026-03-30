import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyzePhrase } from "@/lib/llm";
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
        { status: 429, headers: rateLimitHeaders }
      );
    }
  }

  // ── Parse & validate request ───────────────────────────────────────────────
  let query: string;
  let location: string;
  let sourceLang: string;
  try {
    const body = await request.json();
    query = (body.query ?? "").trim();
    location = (body.location ?? "").trim();
    sourceLang = (body.sourceLang ?? "English").trim();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }

  if (query.length < 5) {
    return NextResponse.json(
      {
        error:
          'Query too short. Try something like: \'Is "zwei Bier bitte" natural in Bavaria?\'',
        code: "QUERY_TOO_SHORT",
      },
      { status: 400 }
    );
  }

  if (query.length > 600) {
    return NextResponse.json(
      { error: "Query too long. Please keep it under 600 characters.", code: "QUERY_TOO_LONG" },
      { status: 400 }
    );
  }

  // ── Analyse ────────────────────────────────────────────────────────────────
  try {
    const result = await analyzePhrase(query, sourceLang, location);
    return NextResponse.json(result, { headers: rateLimitHeaders });
  } catch (error) {
    console.error("[/api/analyze] Error:", error);
    return NextResponse.json(
      {
        error: "Analysis failed. Please try again in a moment.",
        code: "ANALYSIS_FAILED",
      },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
