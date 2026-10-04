export default function DashboardLoading() {
  return <main className="min-h-[60vh] animate-pulse p-6"><div className="h-3 w-32 rounded bg-slate-200" /><div className="mt-3 h-8 w-64 rounded bg-slate-200" /><div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-white" />)}</div><p className="mt-6 text-[11px] text-slate-400">Loading your academy dashboard…</p></main>;
}
