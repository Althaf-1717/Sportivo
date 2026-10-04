import { ArrowUpRight, Check } from "lucide-react";
import { money } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function MembershipCard({ plan, featured = false }) {
  return <article className={`relative flex h-full flex-col rounded-2xl border p-6 ${featured ? "border-navy bg-navy text-white shadow-[0_18px_50px_rgba(11,31,58,.16)]" : "border-slate-200 bg-white"}`}>
    {featured && <span className="absolute -top-3 right-5 rounded-full bg-orange px-3 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">Most popular</span>}
    <p className={`text-[11px] font-bold uppercase tracking-[.13em] ${featured ? "text-white/60" : "text-blue"}`}>{plan.name} plan</p>
    <div className="mt-3 flex items-end gap-2"><strong className="text-[32px] font-bold tracking-[-.06em]">{money(plan.price)}</strong><span className={`pb-1 text-[11px] ${featured ? "text-white/55" : "text-slate-500"}`}>/ {plan.durationLabel || `${plan.duration} months`}</span></div>
    <p className={`mt-3 min-h-10 text-xs leading-5 ${featured ? "text-white/65" : "text-slate-500"}`}>{plan.description}</p>
    <div className={`my-5 h-px ${featured ? "bg-white/10" : "bg-slate-100"}`} />
    <ul className="grid flex-1 content-start gap-3">{(plan.features || []).map((feature) => <li key={feature} className={`flex items-start gap-2 text-[11px] leading-5 ${featured ? "text-white/80" : "text-slate-600"}`}><Check size={14} className="mt-0.5 shrink-0 text-orange" />{feature}</li>)}</ul>
    <Button href={`/login?plan=${plan.slug || plan._id}`} variant={featured ? "primary" : "secondary"} className="mt-6 w-full">Choose {plan.name} <ArrowUpRight size={14} /></Button>
  </article>;
}
