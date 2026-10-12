export default function CoachDashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-xs">
        <div className="h-3 w-28 rounded-full bg-orange-100" />
        <div className="mt-3 h-7 w-56 rounded-xl bg-stone-200/80" />
        <div className="mt-2 h-4 w-80 max-w-full rounded-lg bg-stone-100" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="h-80 rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-xs" />
        <div className="h-80 rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-xs" />
      </div>
    </div>
  );
}
