"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { useAuthContext } from "@/contexts/AuthContext";

function getTodayCount(): number {
  try {
    const key = `nv_usage_${new Date().toISOString().slice(0, 10)}`;
    return parseInt(localStorage.getItem(key) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function AccountContent() {
  const { isLoaded, isSignedIn, isPro, email } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "true";

  const [usageToday, setUsageToday] = useState(0);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    setUsageToday(getTodayCount());
  }, []);

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleUpgrade() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-black/[0.06] dark:bg-white/[0.06] rounded-xl w-48" />
        <div className="h-32 bg-black/[0.06] dark:bg-white/[0.06] rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      {upgraded && (
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            Welcome to Pro!
          </p>
          <p className="text-xs text-[#86868b]">
            You now have unlimited checks across both tabs. Enjoy!
          </p>
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-8">
        Your account
      </h1>

      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs text-[#86868b] mb-1">Current plan</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {isPro ? "Pro" : "Free"}
              </p>
              {isPro && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  Active
                </span>
              )}
            </div>
          </div>
          {isPro ? (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="text-xs font-medium px-3.5 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-transparent text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors disabled:opacity-50"
            >
              {portalLoading ? "Opening..." : "Manage subscription"}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white transition-colors disabled:opacity-60"
            >
              {checkoutLoading ? "Loading..." : "Upgrade - £4.99/mo"}
            </button>
          )}
        </div>

        <div className="border-t border-black/[0.06] dark:border-white/[0.06] pt-4">
          {isPro ? (
            <div className="flex items-center gap-2 text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
              <span className="text-emerald-500">checkmark</span>
              <span>Unlimited checks - no daily cap</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#86868b]">Checks used today</p>
                <p className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {usageToday} / 10
                </p>
              </div>
              <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (usageToday / 10) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {email && (
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none p-6">
          <p className="text-xs text-[#86868b] mb-3">Account</p>
          <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">{email}</p>
        </div>
      )}
    </>
  );
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b]">
      <Header />
      <main className="max-w-2xl mx-auto px-5 pt-28 pb-20">
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-black/[0.06] dark:bg-white/[0.06] rounded-xl w-48" />
            <div className="h-32 bg-black/[0.06] dark:bg-white/[0.06] rounded-2xl" />
          </div>
        }>
          <AccountContent />
        </Suspense>
      </main>
    </div>
  );
}
