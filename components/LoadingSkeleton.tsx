export function LoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-white/[0.03] overflow-hidden shadow-lg shadow-black/5 dark:shadow-none animate-pulse-subtle">
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-black/8 dark:bg-white/8" />
          <div className="h-4 w-28 rounded-lg bg-black/8 dark:bg-white/8" />
        </div>
        <div className="text-right space-y-1">
          <div className="h-3 w-24 rounded bg-black/8 dark:bg-white/8 ml-auto" />
          <div className="h-2.5 w-14 rounded bg-black/5 dark:bg-white/5 ml-auto" />
        </div>
      </div>
      <div className="px-5 pt-5 pb-6 space-y-5">
        <div>
          <div className="h-2.5 w-20 rounded bg-black/5 dark:bg-white/5 mb-2.5" />
          <div className="h-8 w-52 rounded-lg bg-black/8 dark:bg-white/8" />
        </div>
        <div>
          <div className="h-2.5 w-16 rounded bg-black/5 dark:bg-white/5 mb-2.5" />
          <div className="h-4 w-full rounded bg-black/5 dark:bg-white/5 mb-1.5" />
          <div className="h-4 w-4/5 rounded bg-black/5 dark:bg-white/5" />
        </div>
      </div>
    </div>
  );
}
