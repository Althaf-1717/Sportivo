"use client";
import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { dateLabel } from "@/lib/utils";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const unread = (items || []).filter((item) => !item.readAt).length;

  async function show() {
    const next = !open;
    setOpen(next);
    if (next && items === null) {
      setBusy(true);
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        if (response.ok) setItems(data.notifications);
      } finally {
        setBusy(false);
      }
    }
  }

  async function markAll() {
    setBusy(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setItems((current) =>
        (current || []).map((item) => ({ ...item, readAt: new Date().toISOString() }))
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/80 bg-white/75 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:border-blue/40 hover:bg-white hover:text-navy active:scale-95"
        onClick={show}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full border border-white bg-orange" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2.5 w-[min(340px,calc(100vw-24px))] max-w-[340px] overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-[0_20px_50px_rgba(7,11,20,0.18)] backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100/80 bg-white/50 px-4 py-3 backdrop-blur-sm">
            <div>
              <p className="text-[12px] font-bold text-navy">Notifications</p>
              <p className="text-[9px] font-medium text-slate-400">{unread} unread updates</p>
            </div>
            {unread > 0 && (
              <button
                disabled={busy}
                onClick={markAll}
                className="inline-flex items-center gap-1 rounded-md bg-blue-soft/80 px-2 py-1 text-[9px] font-bold text-blue transition hover:bg-blue hover:text-white"
              >
                <CheckCheck size={11} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[340px] divide-y divide-slate-100/70 overflow-y-auto">
            {busy && !items ? (
              <p className="p-6 text-center text-[10px] text-slate-400">Loading updates…</p>
            ) : items?.length ? (
              items.map((item) => (
                <article
                  key={item._id}
                  className={`px-4 py-3 transition hover:bg-white/80 ${
                    item.readAt ? "bg-white/40" : "bg-blue-soft/40"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        item.readAt ? "bg-slate-300" : "bg-orange shadow-[0_0_8px_rgba(255,85,0,0.5)]"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold leading-snug text-navy">{item.title}</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-slate-600">{item.message}</p>
                      <p className="mt-1 text-[8px] font-semibold tracking-wide text-slate-400">
                        {dateLabel(item.createdAt, {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-[11px] font-medium text-slate-500">You’re all caught up</p>
                <p className="mt-0.5 text-[9px] text-slate-400">No new alerts right now.</p>
              </div>
            )}
          </div>

          <button
            className="w-full border-t border-slate-100/80 bg-white/60 px-4 py-2 text-center text-[10px] font-bold text-slate-500 transition hover:bg-slate-100/80 hover:text-navy"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
