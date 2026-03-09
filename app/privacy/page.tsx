import { Header } from "@/components/Header";

export const metadata = {
  title: "Privacy Policy — NativeFlow",
  description: "How NativeFlow collects and uses your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] text-[#1d1d1f] dark:text-[#f5f5f7]">
      <Header />
      <main className="max-w-2xl mx-auto px-5 pt-24 pb-20">

        <h1 className="text-2xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#86868b] mb-10">Last updated: March 2026</p>

        <div className="border-t border-black/[0.06] dark:border-white/[0.06]" />

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            Who we are
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            NativeFlow is operated by PolyGot Ltd, a company registered in England and Wales. We are the data controller for personal data collected through this service. You can contact us at{" "}
            <a href="mailto:privacy@polygot.com" className="text-indigo-500 hover:text-indigo-400 transition-colors">
              privacy@polygot.com
            </a>
            .
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            What data we collect
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed mb-3">
            We collect as little as possible:
          </p>
          <ul className="space-y-2">
            {[
              "Phrases and queries you submit — processed in real-time by our AI provider and not stored on our servers.",
              "IP address — used only for rate limiting (preventing abuse). Not logged long-term or linked to your identity.",
              "Account email address — if you subscribe to Pro, stored securely via our authentication provider (Clerk).",
              "Payment information — handled entirely by Stripe. We never see or store your card details.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
                <span className="text-indigo-500 mt-0.5 shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            What we don&apos;t collect
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            No tracking pixels. No behavioural analytics. No advertising cookies. No selling or sharing of your data with third parties for marketing purposes. We don't build profiles on free users.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            Third-party services
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed mb-3">
            We use the following sub-processors. Each has its own privacy policy:
          </p>
          <ul className="space-y-3">
            {[
              {
                name: "Anthropic (Claude AI)",
                desc: "Processes your phrase queries to generate analysis results.",
                href: "https://www.anthropic.com/privacy",
              },
              {
                name: "ElevenLabs",
                desc: "Generates natural-sounding audio for Pro subscribers.",
                href: "https://elevenlabs.io/privacy",
              },
              {
                name: "Stripe",
                desc: "Handles payment processing for Pro subscriptions.",
                href: "https://stripe.com/privacy",
              },
              {
                name: "Upstash Redis",
                desc: "Stores ephemeral rate-limit counters keyed by IP address.",
                href: "https://upstash.com/trust/privacy.pdf",
              },
              {
                name: "Vercel",
                desc: "Hosts and serves the application at the edge.",
                href: "https://vercel.com/legal/privacy-policy",
              },
            ].map((s) => (
              <li key={s.name} className="flex gap-2.5 text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
                <span className="text-indigo-500 mt-0.5 shrink-0">·</span>
                <span>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400 transition-colors font-medium">
                    {s.name}
                  </a>
                  {" — "}{s.desc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            Cookies
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            We use only essential session cookies required for the service to function. No advertising or tracking cookies are set. You can disable cookies in your browser, but some features (such as staying signed in) may stop working.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            Data retention
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            Query data is not stored after processing. Rate-limit counters expire automatically. Account data is retained while your subscription is active and for 30 days after cancellation, after which it is deleted. You can request deletion at any time.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            Your rights (UK GDPR)
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed mb-3">
            Under UK GDPR, you have the right to access, rectify, erase, restrict processing of, and port your personal data. To exercise any of these rights, email{" "}
            <a href="mailto:privacy@polygot.com" className="text-indigo-500 hover:text-indigo-400 transition-colors">
              privacy@polygot.com
            </a>
            . We will respond within 30 days.
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400 transition-colors">
              ico.org.uk
            </a>
            .
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            Changes to this policy
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            We&apos;ll update the &quot;last updated&quot; date at the top when we make changes. For material changes, we&apos;ll notify Pro subscribers by email at least 14 days in advance.
          </p>
        </section>

      </main>
    </div>
  );
}
