import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3, Users } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getSportBySlug, getSports, getCoaches, getMembershipPlans } from "@/lib/public-data";
import CoachCard from "@/components/coaches/CoachCard";
import MembershipCard from "@/components/membership/MembershipCard";

export async function generateStaticParams() {
  const sports = await getSports();
  return sports.map((sport) => ({ sportId: sport.slug }));
}

export async function generateMetadata({ params }) {
  const { sportId } = await params;
  const sport = await getSportBySlug(sportId);
  return { title: sport ? `${sport.name} coaching` : "Sport not found", description: sport?.description || "Explore academy coaching." };
}

export default async function SportDetailsPage({ params }) {
  const { sportId } = await params;
  const [sport, coaches, plans] = await Promise.all([getSportBySlug(sportId), getCoaches(), getMembershipPlans()]);
  if (!sport) notFound();
  const sportCoaches = coaches.filter((coach) => coach.sport === sport.name || coach.specialization?.toLowerCase().includes(sport.name.toLowerCase()));
  const sportPlans = plans.filter((plan) => !plan.sport || plan.sport.name === sport.name || plan.sport === sport.name);
  return <PublicLayout><main>
    <section className="bg-paper py-9 sm:py-12"><div className="container-wide grid items-center gap-8 md:grid-cols-[1fr_1.04fr]"><div><Badge>{sport.name} programme</Badge><h1 className="mt-4 text-4xl font-bold tracking-[-.06em] text-navy sm:text-5xl">A better feel for<br /><span className="text-blue">the game.</span></h1><p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">{sport.detail || sport.description}</p><div className="mt-6 flex flex-wrap gap-3"><Button href={`/register?sport=${sport.slug}`}>Start your journey <ArrowRight size={14} /></Button><Button href="/coaches" variant="secondary">Meet the coaches</Button></div><div className="mt-7 flex flex-wrap gap-4 text-[10px] font-medium text-slate-500"><span className="inline-flex items-center gap-1.5"><Users size={13} className="text-blue" /> Small-group coaching</span><span className="inline-flex items-center gap-1.5"><Clock3 size={13} className="text-blue" /> Weekly sessions</span></div></div><div className="relative aspect-[1.5/1] overflow-hidden rounded-[20px] bg-blue-soft"><Image src={sport.image} alt={`${sport.name} at Sportivo`} fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" /></div></div></section>
    <section className="container-wide grid gap-10 py-12 md:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">What you’ll work on</p><h2 className="mt-2 text-2xl font-bold tracking-[-.04em] text-navy">Fundamentals first.<br />Game ready next.</h2><p className="mt-3 text-xs leading-6 text-slate-500">A programme that balances technical skills, athletic development, and the confidence to use what you learn.</p></div><ul className="grid gap-3 sm:grid-cols-2">{(sport.focus || ["Technical foundations", "Game awareness", "Movement and fitness"]).map((item) => <li key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-xs font-semibold text-navy"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-soft text-blue"><Check size={15} /></span>{item}</li>)}</ul></section>
    <section className="bg-paper py-12"><div className="container-wide"><p className="eyebrow">The right support matters</p><h2 className="mt-2 text-2xl font-bold tracking-[-.04em] text-navy">Meet the {sport.name.toLowerCase()} coaches.</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sportCoaches.slice(0, 3).map((coach, i) => <CoachCard key={coach.slug || coach._id} coach={coach} index={i} />)}</div></div></section>
    <section className="container-wide py-12"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Build your routine</p><h2 className="mt-2 text-2xl font-bold tracking-[-.04em] text-navy">Memberships made for progress.</h2></div></div><div className="mt-6 grid gap-4 md:grid-cols-3">{sportPlans.slice(0, 3).map((plan, i) => <MembershipCard key={plan.slug || plan._id} plan={plan} featured={i === 1} />)}</div></section>
  </main></PublicLayout>;
}
