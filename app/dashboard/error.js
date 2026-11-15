"use client";

import Link from "next/link";
import { ArrowLeft, LogOut, RefreshCw } from "lucide-react";

export default function DashboardError({ reset }) {
  return (
    <main className="grid min-h-[60vh] place-items-center p-6">
      <div className="surface-card max-w-md p-7 text-center border border-stone-200 shadow-sm rounded-3xl bg-white">
        <p className="eyebrow text-orange-600">Dashboard notice</p>
        <h2 className="mt-2 text-xl font-bold text-gray-900">
          We couldn’t load this view.
        </h2>
        <p className="mt-2 text-xs leading-6 text-stone-500">
          Your account and training records are safe. You can reload this view or switch to another account.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs"
          >
            <RefreshCw size={14} />
            <span>Try again</span>
          </button>

          <Link
            href="/api/auth/clear"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-gray-900 transition shadow-2xs"
          >
            <LogOut size={14} />
            <span>Switch account / Sign out</span>
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 hover:text-gray-800 transition"
          >
            <ArrowLeft size={13} />
            <span>Back to Sportivo home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
