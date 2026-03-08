import { NextRequest } from "next/server";

const FREE_LIMIT = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory fallback for local dev (not suitable for multi-instance production)
const store = new Map<string, { count: number; resetAt: number }>();

export function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export async function rateLimit(
  ip: string
): Promise<{ success: boolean; remaining: number; limit: number }> {
  // Prefer Upstash Redis if configured
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return rateLimitUpstash(ip);
  }

  // In-memory fallback
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: FREE_LIMIT - 1, limit: FREE_LIMIT };
  }

  if (record.count >= FREE_LIMIT) {
    return { success: false, remaining: 0, limit: FREE_LIMIT };
  }

  record.count++;
  return {
    success: true,
    remaining: FREE_LIMIT - record.count,
    limit: FREE_LIMIT,
  };
}

async function rateLimitUpstash(
  ip: string
): Promise<{ success: boolean; remaining: number; limit: number }> {
  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(FREE_LIMIT, "1 d"),
      prefix: "nv:free",
    });

    const result = await limiter.limit(ip);
    return {
      success: result.success,
      remaining: result.remaining,
      limit: FREE_LIMIT,
    };
  } catch (err) {
    console.error("[NativeVibe] Upstash rate limit error — failing open:", err);
    return { success: true, remaining: FREE_LIMIT, limit: FREE_LIMIT };
  }
}
