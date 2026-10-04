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
  return <form onSubmit={handleSubmit} className="surface-card grid gap-4 p-6 sm:p-8">
    <div className="grid gap-4 sm:grid-cols-2"><label><span className="form-label">Your name</span><input className="form-control" name="name" autoComplete="name" required /></label><label><span className="form-label">Email address</span><input className="form-control" type="email" name="email" autoComplete="email" required /></label></div>
    <label><span className="form-label">What would you like to know?</span><select className="form-control" name="topic" defaultValue="coaching"><option value="coaching">Coaching and sports</option><option value="membership">Memberships</option><option value="first-session">My first session</option><option value="other">Something else</option></select></label>
    <label><span className="form-label">Your message</span><textarea className="form-control min-h-32 resize-y" name="message" minLength={10} required /></label>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    {sent && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">Your note has been sent to the academy team.</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
    <button disabled={busy} className="btn-primary w-fit disabled:opacity-60" type="submit">{busy ? "Sending…" : "Send your note"} <Send size={14} /></button>
  </form>;
}
