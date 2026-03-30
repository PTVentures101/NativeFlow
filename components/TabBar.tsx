interface TabBarProps {
  active: "check" | "phrases";
  onChange: (tab: "check" | "phrases") => void;
}

const TABS = [
  { id: "check" as const, label: "Check a Phrase" },
  { id: "phrases" as const, label: "Get Phrases" },
];

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex justify-center mb-5">
      <div className="inline-flex gap-1 p-1 rounded-xl bg-black/[0.06] dark:bg-white/[0.07]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200
              ${
                active === tab.id
                  ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/30"
                  : "text-[#86868b] dark:text-[#6c6c70] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
