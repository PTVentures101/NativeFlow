import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { FlashcardsBadge } from "./FlashcardsBadge";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] dark:border-white/[0.06] bg-[#f5f5f7]/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-base tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] select-none">
            Native<span className="text-indigo-500">Flow</span>
          </span>
          <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-[#86868b]">by PolyGot</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/flashcards" className="hidden sm:block text-xs font-medium text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors px-2 py-1">
            <FlashcardsBadge />
          </Link>
          <Link href="/pricing" className="hidden sm:block text-xs font-medium text-[#86868b] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors px-2 py-1">
            Pricing
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
