import { Suspense } from "react";
import Image from "next/image";
import AuthForm from "@/components/forms/AuthForm";

export const metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  const databaseConfigured = Boolean(process.env.MONGODB_URI);
  const googleEnabled = Boolean(databaseConfigured && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <main className="grid min-h-screen lg:grid-cols-[1fr_.9fr]"><section className="flex items-center justify-center px-6 py-10 sm:px-10"><Suspense fallback={<div className="h-[560px] w-full max-w-[440px] animate-pulse rounded-2xl bg-paper" />}><AuthForm mode="login" databaseConfigured={databaseConfigured} googleEnabled={googleEnabled} /></Suspense></section><aside className="relative hidden overflow-hidden bg-navy lg:block"><Image src="/images/hero-football.png" alt="Footballer training at the academy" fill sizes="50vw" className="object-cover object-[60%_center] opacity-65" /><div className="absolute inset-0 bg-navy/45" /><div className="absolute bottom-12 left-10 right-10 text-white"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-orange">Train. Improve. Perform.</p><p className="mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-[-.04em]">Your next session is a chance to be a little better.</p><p className="mt-3 text-xs text-white/65">Pick up where you left off, with your coach and team behind you.</p></div></aside></main>;
}
