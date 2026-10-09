"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = event.currentTarget;
    if (!form.reportValidity()) { setBusy(false); return; }
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t send your note just now.");
      setSent(true);
      form.reset();
    } catch (submitError) { setError(submitError.message); }
    finally { setBusy(false); }
  }
  return (
    <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-6 sm:p-8 backdrop-blur-xl shadow-[0_16px_40px_-10px_rgba(7,11,20,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="form-label">Your name</span>
          <input className="form-control glass-input" name="name" autoComplete="name" required placeholder="e.g. Rahul Sharma" />
        </label>
        <label>
          <span className="form-label">Email address</span>
          <input className="form-control glass-input" type="email" name="email" autoComplete="email" required placeholder="name@example.com" />
        </label>
      </div>
      <label>
        <span className="form-label">What would you like to know?</span>
        <select className="form-control glass-input cursor-pointer" name="topic" defaultValue="coaching">
          <option value="coaching">Coaching and sports programmes</option>
          <option value="membership">Memberships & training plans</option>
          <option value="first-session">Trial sessions & academy visit</option>
          <option value="other">Something else</option>
        </select>
      </label>
      <label>
        <span className="form-label">Your message</span>
        <textarea className="form-control glass-input min-h-32 resize-y" name="message" minLength={10} required placeholder="Tell us about your goals, sport of interest, or questions..." />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {sent && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs">
          ✓ Your message has been sent to the academy coaching team. We will respond within 24 hours.
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-semibold text-rose-700 shadow-2xs">
          {error}
        </p>
      )}
      <button disabled={busy} className="btn-primary w-full sm:w-fit disabled:opacity-60 shadow-md" type="submit">
        {busy ? "Sending…" : "Send your note"} <Send size={14} />
      </button>
    </form>
  );
}
