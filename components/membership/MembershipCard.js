import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { money } from "@/lib/utils";
import InteractivePillButton from "@/components/ui/InteractivePillButton";

export default function MembershipCard({ plan, featured = false, index = 0 }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-3xl border p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 ${
        featured
          ? "border-orange-500/40 bg-[#1c1411] text-white shadow-[0_28px_70px_-15px_rgba(234,88,12,0.32)] ring-2 ring-orange-500/40"
          : "border-stone-200/90 bg-white text-gray-900 shadow-[0_18px_48px_-15px_rgba(28,25,23,0.07)] hover:border-orange-300"
      }`}
    >
      {featured && (
        <span className="absolute -top-3.5 right-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-md">
          <Sparkles size={11} /> Most Popular
        </span>
      )}

      <div className="flex items-center justify-between">
        <p
          className={`text-xs font-extrabold uppercase tracking-[0.16em] ${
            featured ? "text-orange-400" : "text-orange-600"
          }`}
        >
          {plan.name} Plan
        </p>
        <span
          className={`text-xs font-bold ${
            featured ? "text-white/40" : "text-stone-400"
          }`}
        >
          0{index + 1 || (featured ? 2 : 1)}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <strong className="text-4xl font-extrabold tracking-tight">
          {money(plan.price)}
        </strong>
        <span
          className={`text-xs font-medium ${
            featured ? "text-stone-400" : "text-stone-500"
          }`}
        >
          / {plan.durationLabel || `${plan.duration} months`}
        </span>
      </div>

      <p
        className={`mt-3 min-h-10 text-xs leading-relaxed ${
          featured ? "text-stone-300" : "text-stone-600"
        }`}
      >
        {plan.description}
      </p>

      <div
        className={`my-6 h-px ${
          featured ? "bg-white/12" : "bg-stone-200/80"
        }`}
      />

      <p
        className={`mb-3 text-[11px] font-bold uppercase tracking-wider ${
          featured ? "text-stone-400" : "text-stone-400"
        }`}
      >
        Includes
      </p>

      <ul className="grid flex-1 content-start gap-3">
        {(plan.features || []).map((feature) => (
          <li
            key={feature}
            className={`flex items-start gap-2.5 text-xs leading-5 font-medium ${
              featured ? "text-stone-200" : "text-stone-700"
            }`}
          >
            <span
              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                featured
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <InteractivePillButton
        href={`/login?plan=${plan.slug || plan._id}`}
        variant={featured ? "orange" : "dark"}
        orbSize={36}
        className="mt-8 w-full py-3.5 px-6 text-xs font-bold"
      >
        <span>Choose {plan.name}</span>
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </InteractivePillButton>
    </article>
  );
}
