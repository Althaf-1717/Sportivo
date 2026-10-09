import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { money } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function MembershipCard({ plan, featured = false }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
        featured
          ? "border-orange/30 bg-[#070b14]/90 text-white shadow-[0_24px_60px_-10px_rgba(7,11,20,0.4),inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-orange/20"
          : "border-white/80 bg-white/75 text-navy shadow-[0_12px_36px_-6px_rgba(7,11,20,0.05),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:border-white hover:bg-white/85 hover:shadow-[0_20px_45px_-8px_rgba(7,11,20,0.09)]"
      }`}
    >
      {featured && (
        <span className="absolute -top-3.5 right-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange to-[#ff7a00] px-3.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[.14em] text-white shadow-md">
          <Sparkles size={11} /> Most popular
        </span>
      )}
      <p
        className={`text-[11px] font-extrabold uppercase tracking-[.16em] ${
          featured ? "text-orange" : "text-blue"
        }`}
      >
        {plan.name} Tier
      </p>
      <div className="mt-3.5 flex items-baseline gap-2">
        <strong className="text-[34px] font-black tracking-[-.05em] font-mono">
          {money(plan.price)}
        </strong>
        <span
          className={`text-[11.5px] font-medium ${
            featured ? "text-white/60" : "text-slate-500"
          }`}
        >
          / {plan.durationLabel || `${plan.duration} months`}
        </span>
      </div>
      <p
        className={`mt-3 min-h-10 text-xs leading-5 font-normal ${
          featured ? "text-white/70" : "text-slate-600"
        }`}
      >
        {plan.description}
      </p>
      <div
        className={`my-5 h-px ${featured ? "bg-white/12" : "bg-slate-200/80"}`}
      />
      <ul className="grid flex-1 content-start gap-3">
        {(plan.features || []).map((feature) => (
          <li
            key={feature}
            className={`flex items-start gap-2.5 text-[11.5px] leading-5 font-medium ${
              featured ? "text-white/85" : "text-slate-600"
            }`}
          >
            <span
              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                featured ? "bg-orange/20 text-orange" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        href={`/login?plan=${plan.slug || plan._id}`}
        variant={featured ? "primary" : "secondary"}
        className="mt-7 w-full shadow-md"
      >
        Choose {plan.name} <ArrowUpRight size={14} />
      </Button>
    </article>
  );
}
