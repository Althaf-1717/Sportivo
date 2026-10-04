import PublicLayout from "@/components/layout/PublicLayout";
import ContactForm from "@/components/forms/ContactForm";

export const metadata = { title: "Contact", description: "Ask the Sportivo Academy team about sports, coaching, or memberships." };

export default function ContactPage() {
  return <PublicLayout><main className="min-h-[65vh] bg-paper py-12 sm:py-16"><div className="container-wide grid gap-8 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">We’re happy to help</p><h1 className="mt-2 text-4xl font-bold tracking-[-.06em] text-navy">Let’s talk sport.</h1><p className="section-copy mt-4 max-w-md">Have a question about coaching, memberships, or your first session? Send us a note and the academy team will get back to you.</p><div className="mt-7 rounded-2xl bg-navy p-5 text-white"><p className="text-xs font-bold">Sportivo Academy</p><p className="mt-2 text-[11px] leading-6 text-white/60">Bengaluru, Karnataka<br />India</p><p className="mt-4 text-[10px] leading-5 text-white/45">Ask us about training, memberships, or visiting for your first session.</p></div></div><ContactForm /></div></main></PublicLayout>;
}
