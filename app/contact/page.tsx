import { Header } from "@/components/Header";

export const metadata = {
  title: "Contact — NativeFlow",
  description: "Get in touch with the NativeFlow team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] text-[#1d1d1f] dark:text-[#f5f5f7]">
      <Header />
      <main className="max-w-2xl mx-auto px-5 pt-24 pb-20">

        <h1 className="text-2xl font-semibold mb-2">Get in touch</h1>
        <p className="text-sm text-[#86868b] mb-10">
          We read everything and reply to most things.
        </p>

        <div className="border-t border-black/[0.06] dark:border-white/[0.06]" />

        <section className="mt-8">
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed mb-8">
            Whether you have a question about how NativeFlow works, spotted a bug, have feedback on a result, or want to talk about a partnership — drop us a line. We&apos;re a small team and we take user feedback seriously.
          </p>

          <a
            href="mailto:hello@polygot.com"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all text-white font-semibold text-sm shadow-sm shadow-indigo-500/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            hello@polygot.com
          </a>

          <p className="text-xs text-[#86868b] mt-4">
            We aim to reply within 2 business days.
          </p>
        </section>

      </main>
    </div>
  );
}
