import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, ShieldCheck } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { getMembershipPlans } from "@/lib/public-data";
import { money } from "@/lib/utils";

export async function generateStaticParams() { return ["basic", "standard", "premium"].map((planId) => ({ planId })); }
export async function generateMetadata({ params }) { const { planId } = await params; const plans = await getMembershipPlans(); const plan = plans.find((item) => item.slug === planId || String(item._id) === planId); return { title: plan ? `${plan.name} membership` : "Membership not found", description: plan?.description || "Explore a Sportivo membership." }; }

export default async function MembershipDetailPage({ params }) {
  const { planId } = await params;
  const plans = await getMembershipPlans();
  const plan = plans.find((item) => item.slug === planId || String(item._id) === planId);
  if (!plan) notFound();
  return <PublicLayout><main className="grid min-h-[70vh] place-items-center bg-paper px-4 py-12"><article className="surface-card w-full max-w-2xl p-6 sm:p-9"><p className="eyebrow">Membership details</p><h1 className="mt-2 text-3xl font-bold tracking-[-.05em] text-navy">{plan.name}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{plan.description}</p><div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1"><strong className="text-4xl font-bold tracking-[-.06em] text-navy">{money(plan.price)}</strong><span className="pb-1 text-xs text-slate-500">for {plan.durationLabel || `${plan.duration} months`}</span></div><div className="my-6 h-px bg-slate-100" /><h2 className="text-xs font-bold text-navy">What’s included</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />{feature}</li>)}</ul><div className="mt-6 grid gap-3 sm:grid-cols-2"><p className="flex items-center gap-2 rounded-xl bg-paper p-3 text-[10px] text-slate-600"><CalendarDays size={14} className="text-blue" />Choose your sport during enrolment</p><p className="flex items-center gap-2 rounded-xl bg-paper p-3 text-[10px] text-slate-600"><ShieldCheck size={14} className="text-emerald-600" />Secure Razorpay checkout</p></div><Button href={`/register?plan=${plan.slug || plan._id}`} className="mt-7">Select this plan</Button></article></main></PublicLayout>;
}
