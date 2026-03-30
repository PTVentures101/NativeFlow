"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const TIERS = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started — no card required.",
    color: "border-black/[0.08] dark:border-white/[0.08]",
    badge: null,
    cta: "Get started",
    ctaHref: "/",
    ctaStyle: "bg-[#1d1d1f] dark:bg-[#f5f5f7] text-[#f5f5f7] dark:text-[#1d1d1f] hover:opacity-80",
    features: [
      { label: "10 checks per day", included: true },
      { label: "3 situational phrases per result", included: true },
      { label: "Natural voice audio", included: false },
      { label: "Flashcard drilling", included: false },
      { label: "Explain in your language", included: false },
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 4.99,
    annualPrice: 49,
    description: "For serious language learners.",
    color: "border-indigo-500/40",
    badge: "Most popular",
    cta: "Get Pro",
    ctaHref: "#",
    ctaStyle: "bg-indigo-500 hover:bg-indigo-600 text-white",
    features: [
      { label: "Unlimited checks", included: true },
      { label: "10 situational phrases per result", included: true },
      { label: "Natural voice audio", included: true },
      { label: "Flashcard drilling", included: true },
      { label: "Explain in your language", included: true },
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "I've been studying Spanish for three years. NativeFlow told me more about how people in Málaga actually speak than my entire course did.",
    name: "James T.",
    context: "Learning Spanish",
  },
  {
    quote: "I was using textbook French in Paris and wondering why people looked confused. This app showed me exactly what I was getting wrong.",
    name: "Sarah K.",
    context: "Learning French",
  },
  {
    quote: "The regional detail is what makes it. 'Natural in Tokyo' is a completely different verdict to 'natural in Osaka'.",
    name: "Mihail R.",
    context: "Learning Japanese",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { isSignedIn, openSignIn } = useAuthContext();
  const router = useRouter();

  async function handleProCta() {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) router.push(data.url);
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* Header bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-[#f5f5f7]/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[11px] font-medium text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <h1 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Pricing</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-5 pt-12 pb-28 sm:pb-12">
        {/* Headline */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
            Simple, transparent pricing
          </h2>
          <p className="text-sm text-[#86868b]">
            Sound like a native — no surprises on your bill.
          </p>
        </div>

        {/* Monthly / Annual toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-xs font-medium transition-colors ${!annual ? "text-[#1d1d1f] dark:text-[#f5f5f7]" : "text-[#86868b]"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual((v) => !v)}
            className={`relative w-10 h-5.5 rounded-full transition-colors focus:outline-none ${annual ? "bg-indigo-500" : "bg-[#e0e0e5] dark:bg-[#2a2a2e]"}`}
            style={{ height: "22px" }}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${annual ? "translate-x-[18px]" : "translate-x-0"}`}
            />
          </button>
          <span className={`text-xs font-medium transition-colors ${annual ? "text-[#1d1d1f] dark:text-[#f5f5f7]" : "text-[#86868b]"}`}>
            Annual
            <span className="ml-1.5 inline-block text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              2 months free
            </span>
          </span>
        </div>

        {/* Testimonials */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-[#86868b] mb-4 text-center">
            What people say
          </p>
          <div className="flex flex-col gap-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-5 py-4">
                <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-[11px] font-medium text-[#86868b]">
                  {t.name} &middot; <span className="font-normal">{t.context}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
          {TIERS.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            const perMonth = annual && tier.annualPrice > 0
              ? (tier.annualPrice / 12).toFixed(2)
              : null;

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border bg-white/60 dark:bg-white/[0.03] p-6 flex flex-col gap-5 ${tier.color}`}
              >
                {/* Badge */}
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {tier.badge}
                  </span>
                )}

                {/* Name + description */}
                <div>
                  <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">{tier.name}</p>
                  <p className="text-[11px] text-[#86868b]">{tier.description}</p>
                </div>

                {/* Price */}
                <div>
                  {price === 0 ? (
                    <p className="text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Free</p>
                  ) : (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                          £{perMonth ?? price}
                        </span>
                        <span className="text-xs text-[#86868b] mb-1.5">/mo</span>
                      </div>
                      {annual && (
                        <p className="text-[11px] text-[#86868b] mt-0.5">
                          £{price} billed annually
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA */}
                {tier.name === "Pro" ? (
                  <button
                    onClick={handleProCta}
                    disabled={checkoutLoading}
                    className={`block w-full text-center text-xs font-semibold py-2 rounded-lg transition-colors ${tier.ctaStyle} disabled:opacity-60`}
                  >
                    {checkoutLoading ? "Loading…" : tier.cta}
                  </button>
                ) : (
                  <a
                    href={tier.ctaHref}
                    className={`block text-center text-xs font-semibold py-2 rounded-lg transition-opacity ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                  </a>
                )}

                {/* Feature list */}
                <ul className="flex flex-col gap-2.5">
                  {tier.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2">
                      {f.included ? (
                        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#d1d1d6] dark:text-[#3a3a3e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                      <span className={`text-[11px] leading-snug ${f.included ? "text-[#1d1d1f] dark:text-[#e0e0e5]" : "text-[#86868b]"}`}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#86868b] mt-8">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </main>
  );
}
