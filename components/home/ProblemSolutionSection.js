import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  ClipboardList,
  MessageSquareWarning,
  FileSpreadsheet,
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const chaosPillsRow1 = [
  { icon: Users, label: "Overcrowded 30-player batches" },
  { icon: MessageSquareWarning, label: "WhatsApp schedule chaos" },
  { icon: FileSpreadsheet, label: "Paper attendance registers" },
  { icon: AlertCircle, label: "Zero written coach feedback" },
  { icon: Calendar, label: "Missed trial & renewal reminders" },
  { icon: ClipboardList, label: "Manual fee receipt tracking" },
];

const chaosPillsRow2 = [
  { icon: AlertCircle, label: "No clear skill milestones" },
  { icon: MessageSquareWarning, label: "Last-minute ground changes" },
  { icon: FileSpreadsheet, label: "Scattered fitness spreadsheets" },
  { icon: Users, label: "Rotating unverified trainers" },
  { icon: ClipboardList, label: "Lost payment confirmations" },
  { icon: Calendar, label: "Inconsistent drill routines" },
];

const comparisons = [
  {
    problem: "30+ athletes crammed into a single ground with zero individual correction",
    solution: "Strict 1 : 6 coach-to-athlete cohort ratio for focused technical feedback",
  },
  {
    problem: "Attendance scribbled in notebooks and schedules buried in WhatsApp chats",
    solution: "Live digital attendance logs, session history, and instant portal updates",
  },
  {
    problem: "Parents and athletes guessing if their game is actually improving",
    solution: "Structured skill evaluations across technique, fitness, and match readiness",
  },
  {
    problem: "Awkward cash reminders and lost paper membership receipts",
    solution: "Transparent season plans with instant Razorpay checkout & downloadable receipts",
  },
];

export default function ProblemSolutionSection() {
  return (
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="container-wide">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="pill inline-flex items-center gap-1.5">
            <Sparkles size={12} /> Why athletes switch to Sportivo
          </span>
          <h2 className="mt-4 font-extrabold tracking-tight text-gray-900 text-3xl sm:text-5xl leading-[1.12]">
            Athletic training is hard enough.{" "}
            <br className="hidden sm:block" />
            Your academy shouldn’t make it{" "}
            <span className="text-gradient-brand italic font-bold">
              harder
            </span>
            .
          </h2>
          <p className="mt-4 text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Most sports academies still run on crowded fields, paper registers, and guesswork. Sportivo replaces the clutter with one structured coaching & progress system.
          </p>
        </ScrollReveal>
      </div>

      {/* Infinite Dual-Row Marquee Strip (GPU Transform Only) */}
      <div className="relative mt-10 space-y-3 py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee-left gap-3">
          {[...chaosPillsRow1, ...chaosPillsRow1].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.label}-${idx}`}
                className="mx-1.5 inline-flex items-center gap-2.5 rounded-full border border-stone-200/90 bg-white/90 px-4 py-2.5 text-xs font-semibold text-stone-600 shadow-2xs"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <Icon size={13} />
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="animate-marquee-right gap-3">
          {[...chaosPillsRow2, ...chaosPillsRow2].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.label}-${idx}`}
                className="mx-1.5 inline-flex items-center gap-2.5 rounded-full border border-stone-200/90 bg-white/90 px-4 py-2.5 text-xs font-semibold text-stone-600 shadow-2xs"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                  <Icon size={13} />
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem vs. Solution Comparison Grid */}
      <div className="container-wide mt-12">
        <ScrollReveal delay={120}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Old Way Card */}
            <div className="rounded-3xl border border-stone-200/90 bg-white/75 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-600">
                    The Old Routine
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-gray-900">
                    Scattered Coaching & Guesswork
                  </h3>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60">
                  <AlertCircle size={20} />
                </span>
              </div>
              <ul className="mt-6 space-y-4">
                {comparisons.map((row) => (
                  <li
                    key={row.problem}
                    className="flex items-start gap-3 text-sm leading-relaxed text-stone-600"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
                      ✕
                    </span>
                    <span>{row.problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sportivo Way Card */}
            <div className="relative overflow-hidden rounded-3xl border border-orange-300/80 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/40 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(234,88,12,0.16)] ring-1 ring-orange-500/15">
              <div className="flex items-center justify-between border-b border-orange-200/60 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-600">
                    The Sportivo Way
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-gray-900">
                    Structured Cohorts & Live Progress
                  </h3>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-md">
                  <ShieldCheck size={20} />
                </span>
              </div>
              <ul className="mt-6 space-y-4">
                {comparisons.map((row) => (
                  <li
                    key={row.solution}
                    className="flex items-start gap-3 text-sm font-medium leading-relaxed text-gray-900"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={14} />
                    </span>
                    <span>{row.solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
