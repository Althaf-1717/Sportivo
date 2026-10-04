import { Suspense } from "react";
import Image from "next/image";
import AuthForm from "@/components/forms/AuthForm";

export const metadata = { title: "Join the academy", robots: { index: false } };

export default function RegisterPage() {
  const databaseConfigured = Boolean(process.env.MONGODB_URI);
  const googleEnabled = Boolean(databaseConfigured && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <main className="grid min-h-screen lg:grid-cols-[.9fr_1fr]"><aside className="relative hidden overflow-hidden bg-navy lg:block"><Image src="/images/hero-football.png" alt="A player starting a training session" fill sizes="50vw" className="object-cover object-[60%_center] opacity-65" /><div className="absolute inset-0 bg-navy/45" /><div className="absolute bottom-12 left-10 right-10 text-white"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-orange">Made for your next step</p><p className="mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-[-.04em]">Find your sport. Meet your people. Keep growing.</p><p className="mt-3 text-xs text-white/65">Your Sportivo account keeps your training and progress together.</p></div></aside><section className="flex items-center justify-center px-6 py-10 sm:px-10"><Suspense fallback={<div className="h-[610px] w-full max-w-[440px] animate-pulse rounded-2xl bg-paper" />}><AuthForm mode="register" databaseConfigured={databaseConfigured} googleEnabled={googleEnabled} /></Suspense></section></main>;
}
