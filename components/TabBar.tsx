interface TabBarProps {
  active: "check" | "phrases";
  onChange: (tab: "check" | "phrases") => void;
}

const TABS = [
  { id: "check" as const, label: "Check a Phrase" },
  { id: "phrases" as const, label: "Get Phrases" },
];

export function TabBar({ active, onChange }: TabBarProps) {
  const colours = {
    check: {
      active: "bg-amber-500 text-white shadow-sm shadow-amber-500/30",
      inactive: "text-amber-600/70 dark:text-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/[0.08]",
    },
    phrases: {
      active: "bg-indigo-500 text-white shadow-sm shadow-indigo-500/30",
      inactive: "text-indigo-500/70 dark:text-indigo-400/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/[0.08]",
    },
  };

  return (
    <div className="flex justify-center mb-5">
      <div className="inline-flex gap-1 p-1 rounded-xl bg-black/[0.06] dark:bg-white/[0.07]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200
              ${active === tab.id ? colours[tab.id].active : colours[tab.id].inactive}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
