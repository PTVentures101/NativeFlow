"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSavedPhrasesContext } from "@/contexts/SavedPhrasesContext";

export function BottomNav() {
  const pathname = usePathname();
  const { phrases, isLoaded } = useSavedPhrasesContext();
  const learningCount = isLoaded
    ? phrases.filter((p) => p.status === "learning").length
    : 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-black/[0.06] dark:border-white/[0.06] bg-[#f5f5f7]/90 dark:bg-[#09090b]/90 backdrop-blur-xl pb-safe">
      <div className="flex items-stretch h-16">
        <NavTab href="/" label="Check" isActive={pathname === "/"}>
          <HomeIcon active={pathname === "/"} />
        </NavTab>
        <NavTab href="/flashcards" label="Flashcards" isActive={pathname === "/flashcards"}>
          <div className="relative">
            <FlashcardsIcon active={pathname === "/flashcards"} />
            {learningCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-indigo-500 text-white text-[9px] font-bold leading-none">
                {learningCount > 99 ? "99+" : learningCount}
              </span>
            )}
          </div>
        </NavTab>
        <NavTab href="/pricing" label="Pricing" isActive={pathname === "/pricing"}>
          <PricingIcon active={pathname === "/pricing"} />
        </NavTab>
      </div>
    </nav>
  );
}

function NavTab({
  href,
  label,
  isActive,
  children,
}: {
  href: string;
  label: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center justify-center gap-1 select-none transition-colors duration-150 ${
        isActive ? "text-indigo-500" : "text-[#86868b] active:text-indigo-400"
      }`}
    >
      {children}
      <span className={`text-[10px] font-medium leading-none ${isActive ? "text-indigo-500" : "text-[#86868b]"}`}>
        {label}
      </span>
    </Link>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function FlashcardsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function PricingIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}
