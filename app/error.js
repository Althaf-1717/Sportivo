"use client";

export default function GlobalError({ reset }) {
  return <main className="grid min-h-screen place-items-center bg-paper px-6"><div className="surface-card max-w-md p-8 text-center"><p className="eyebrow">A quick reset</p><h1 className="mt-3 text-2xl font-bold text-navy">Something didn’t load</h1><p className="mt-2 text-sm leading-6 text-slate-500">Please try again. Your account and training information are safe.</p><button className="btn-primary mt-6" onClick={() => reset()}>Try again</button></div></main>;
}
