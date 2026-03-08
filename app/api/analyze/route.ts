import { NextRequest, NextResponse } from "next/server";
import { analyzePhrase } from "@/lib/llm";
import { getIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip = getIp(request);
  const { success, remaining, limit } = await rateLimit(ip);

  const rateLimitHeaders = {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
  };

  if (!success) {
    return NextResponse.json(
      {
        error:
          "You've reached the free daily limit of 10 checks. Upgrade to Plus for unlimited access.",
        code: "RATE_LIMITED",
      },
      { status: 429, headers: rateLimitHeaders }
    );
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
    const augmentedQuery = location
      ? `${query}\n\n[User-specified location context: ${location}]`
      : query;
    const result = await analyzePhrase(augmentedQuery, sourceLang);
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
