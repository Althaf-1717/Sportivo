import { Database, KeyRound, ShieldCheck, WalletCards } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const settings = [
    ["MongoDB", Boolean(process.env.MONGODB_URI), "MONGODB_URI", "Stores academy accounts, memberships, payments, attendance, and progress."],
    ["Google sign-in", Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET", "OAuth sign-in is available after adding Google credentials."],
    ["Razorpay test checkout", Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === process.env.RAZORPAY_KEY_ID), "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / NEXT_PUBLIC_RAZORPAY_KEY_ID", "Matching test keys create browser checkout orders and verify payment signatures."],
    ["Session security", Boolean(process.env.AUTH_SECRET), "AUTH_SECRET", "A long random secret signs encrypted Auth.js sessions."],
  ];
  const icons = [Database, ShieldCheck, WalletCards, KeyRound];
  return <div><PageIntro eyebrow="Configuration" title="Academy settings" description="This project keeps secrets on the server. Set values in your local .env file and restart Next.js." /><div className="grid gap-3 lg:grid-cols-2">{settings.map(([name, ready, variable, details], index) => { const Icon = icons[index]; return <section key={name} className="surface-card p-5"><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-soft text-blue"><Icon size={17} /></span><span className={ready ? "status-good" : "status-warn"}>{ready ? "Configured" : "Needs setup"}</span></div><h2 className="mt-4 text-sm font-bold text-navy">{name}</h2><p className="mt-2 text-[10px] leading-5 text-slate-500">{details}</p><code className="mt-4 block rounded-lg bg-paper px-3 py-2 text-[9px] text-slate-600">{variable}</code></section>; })}</div><p className="mt-5 rounded-xl border border-orange/20 bg-orange/5 p-4 text-[10px] leading-5 text-slate-600">Coach and admin roles are provisioned by the academy. Public sign-up always creates a student account. Razorpay must use test credentials during development.</p></div>;
}
