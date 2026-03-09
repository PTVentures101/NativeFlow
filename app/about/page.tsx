import { Header } from "@/components/Header";

export const metadata = {
  title: "About — NativeFlow",
  description: "What NativeFlow is, who it's for, and the PolyGot story.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] text-[#1d1d1f] dark:text-[#f5f5f7]">
      <Header />
      <main className="max-w-2xl mx-auto px-5 pt-24 pb-20">

        <h1 className="text-2xl font-semibold mb-2">About NativeFlow</h1>
        <p className="text-sm text-[#86868b] mb-10">
          Built for people who want to sound like they actually live there.
        </p>

        <div className="border-t border-black/[0.06] dark:border-white/[0.06]" />

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            What it is
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            NativeFlow checks whether a phrase sounds natural to locals — not just grammatically correct, but regionally authentic. Type anything in any language, add a city or region, and get an instant verdict with city-level nuance. We'll tell you what a native would actually say, why your version sounds off (or doesn't), and give you the vocabulary and pronunciation details that textbooks skip.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            Who it's for
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            NativeFlow is for language learners who are past the basics. People who know the grammar but can't shake the feeling their sentences sound like a textbook. People moving abroad who want to blend in, not stand out. Professionals working in a second language who need to get the register right. Travellers who want more than tourist phrases.
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed mt-3">
            If you've ever wondered "would a local actually say this?" — this is for you.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            How it works
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            You type a phrase and a location. NativeFlow uses Claude AI (by Anthropic) to analyse it against regional speech patterns — slang, register, local vocabulary, pronunciation markers. It gives you a verdict, a correction if needed, and a breakdown across tone, vocabulary, pronunciation, and etymology. There's no averaging across a whole country: Málaga Spanish is different from Madrid Spanish, and we treat it that way.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#86868b] mb-3">
            About PolyGot
          </p>
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            PolyGot is a UK-based language tools company. NativeFlow is our first product. We're building tools for people who take languages seriously — not gamified streaks or flashcard apps for beginners, but practical tools for people who are already in the thick of learning and want to go deeper.
          </p>
        </section>

        <div className="border-t border-black/[0.06] dark:border-white/[0.06] mt-10 pt-8">
          <p className="text-sm text-[#3d3d3f] dark:text-[#aeaeb2] leading-relaxed">
            Questions or feedback?{" "}
            <a
              href="/contact"
              className="text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              Get in touch.
            </a>
          </p>
        </div>

      </main>
    </div>
  );
}
