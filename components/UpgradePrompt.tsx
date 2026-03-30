"use client";

import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";

interface UpgradePromptProps {
  usageCount: number;
  dailyLimit: number;
}

export function UpgradePrompt({ usageCount, dailyLimit }: UpgradePromptProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const atLimit = usageCount >= dailyLimit;
  const nearLimit = usageCount >= dailyLimit - 2;

  if (!nearLimit) return null;

  async function handleUpgrade() {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div
      className={`
        rounded-2xl border px-5 py-4 mt-4
        ${atLimit
          ? "border-amber-500/30 bg-amber-500/[0.06] dark:bg-amber-500/[0.08]"
          : "border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {atLimit ? (
            <>
              <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                You&apos;ve used all {dailyLimit} free checks today
              </p>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Come back tomorrow for a fresh allowance, or upgrade to Pro for unlimited checks across both tabs.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                {dailyLimit - usageCount} free {dailyLimit - usageCount === 1 ? "check" : "checks"} left today
              </p>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Upgrade to Pro for unlimited checks — no daily cap, ever.
              </p>
            </>
          )}
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <Spinner />
          ) : (
            <>Upgrade · £4.99<span className="font-normal opacity-80">/mo</span></>
          )}
        </button>
      </div>

      {/* Usage bar */}
      <div className="mt-3">
        <div className="h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              atLimit ? "bg-amber-500" : "bg-indigo-500"
            }`}
            style={{ width: `${Math.min(100, (usageCount / dailyLimit) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#86868b] mt-1.5">
          {usageCount} of {dailyLimit} free checks used today
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
