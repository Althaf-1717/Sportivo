"use client";

export default function DashboardError({ reset }) {
  return <main className="grid min-h-[50vh] place-items-center"><div className="surface-card max-w-md p-7 text-center"><p className="eyebrow">Dashboard update</p><h2 className="mt-2 text-xl font-bold text-navy">We couldn’t load this view.</h2><p className="mt-2 text-xs leading-6 text-slate-500">Please try again. Your account and training records are safe.</p><button onClick={reset} className="btn-primary mt-5">Try again</button></div></main>;
}
