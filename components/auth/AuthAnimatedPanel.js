import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Users, TrendingUp } from "lucide-react";

const portals = {
  student: {
    label: "Your training, connected",
    title: "A little progress. Every day.",
    description: "Your sessions, your coaches, and your next milestone. All in one place.",
    features: ["Follow your schedule", "Connect with your coach", "See your progress"],
  },
  coach: {
    label: "The coach workspace",
    title: "More time for your athletes.",
    description: "Keep your sessions organised and give every athlete a clear path forward.",
    features: ["Manage session attendance", "Know your athletes", "Share skill evaluations"],
  },
  admin: {
    label: "Academy management",
    title: "An academy that runs smoothly.",
    description: "Bring your people, programmes, and daily operations together in one calm workspace.",
    features: ["Organise your programmes", "Manage athletes and coaches", "Review academy activity"],
  },
};
const icons = [CalendarDays, Users, TrendingUp];

export default function AuthAnimatedPanel({ mode = "login", portal = "student" }) {
  const content = portals[portal] || portals.student;
  return (
    <aside className="relative hidden w-1/2 flex-col border-r border-stone-200/70 bg-[#fffaf5] p-10 lg:flex xl:p-14">
      <style>{`
        @keyframes portalEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .portal-intro { animation: portalEnter 650ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .portal-intro { animation: none; }
        }
      `}</style>
      <Link href="/" className="inline-flex w-fit items-center gap-3" aria-label="Sportivo home">
        <Image src="/images/sportivo-logo.png" alt="" width={40} height={40} className="rounded-xl" />
        <span className="text-xl font-semibold tracking-tight text-stone-900">Sport<span className="text-orange-600">ivo</span></span>
      </Link>

      <div className="portal-intro my-auto w-full max-w-lg py-12">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-orange-700">{mode === "register" ? "Your next chapter starts here" : content.label}</p>
        <h2 className="mt-4 max-w-md text-4xl font-medium leading-[1.15] tracking-tight text-stone-900 xl:text-5xl">
          {mode === "register" ? "Make room for your best game." : content.title}
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-stone-600">{content.description}</p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100">
          <Image src="/images/sport-cricket.jpg" alt="Cricket training at Sportivo" fill sizes="(min-width: 1024px) 40vw, 1px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 text-sm font-medium text-white">Train with purpose. Play with belief.</p>
        </div>

        <ul className="mt-7 divide-y divide-stone-200/70">
          {content.features.map((feature, index) => {
            const Icon = icons[index];
            return <li key={feature} className="flex items-center gap-3 py-3 text-sm text-stone-600"><Icon size={17} strokeWidth={1.5} className="shrink-0 text-orange-600" />{feature}</li>;
          })}
        </ul>
      </div>

      <Link href="/sports" className="inline-flex w-fit items-center gap-2 text-xs text-stone-500 transition-colors hover:text-orange-700">Explore the academy <ArrowUpRight size={14} /></Link>
    </aside>
  );
}
