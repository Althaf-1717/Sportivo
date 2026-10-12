import PublicLayout from "@/components/layout/PublicLayout";
import {
  ArrowRight,
  Heart,
  Target,
  UsersRound,
  ShieldCheck,
  Trophy,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Our story",
  description: "Learn what Sportivo Academy believes about coaching and sport.",
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <main>
        <section className="py-12 sm:py-16">
          <div className="container-wide grid items-center gap-10 md:grid-cols-[.95fr_1.05fr]">
            <div>
              <p className="eyebrow">Why we’re here</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                Sport should make you feel more like{" "}
                <span className="text-gradient-brand italic">yourself</span>.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
                Sportivo is built around a simple idea: coaching is at its best
                when it helps athletes enjoy the game, build disciplined habits,
                and see verified progress every week.
              </p>
              <Button href="/sports" className="mt-7">
                Find your sport <ArrowRight size={14} />
              </Button>
            </div>

            {/* Cohesive Warm-Toned Academy Operating System Card (replaces mismatched football photo) */}
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-gradient-to-br from-[#19110d] via-[#2e170c] to-[#ea580c] p-7 sm:p-9 text-white shadow-[0_28px_70px_-18px_rgba(234,88,12,0.3)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-orange-200">
                  <ShieldCheck size={14} className="text-orange-400" />
                  Sportivo Academy Method
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                  Bengaluru
                </span>
              </div>

              <h2 className="relative z-10 mt-6 text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                Structured 1 : 6 cohorts meets real-time digital tracking.
              </h2>
              <p className="relative z-10 mt-2 text-xs sm:text-sm leading-relaxed text-orange-100/85">
                Every athlete trains in small groups led by accredited coaches,
                backed by live attendance records and skill evaluations.
              </p>

              <div className="relative z-10 mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/15 bg-black/25 p-3.5">
                  <Trophy size={16} className="text-orange-300" />
                  <p className="mt-2 text-lg font-extrabold text-white">
                    3 Sports
                  </p>
                  <p className="text-[11px] text-orange-200/75">
                    Cricket, Football &amp; Basketball
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-black/25 p-3.5">
                  <UsersRound size={16} className="text-amber-300" />
                  <p className="mt-2 text-lg font-extrabold text-white">
                    1 : 6 Ratio
                  </p>
                  <p className="text-[11px] text-orange-200/75">
                    Personal attention every drill
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-black/25 p-3.5">
                  <Activity size={16} className="text-emerald-300" />
                  <p className="mt-2 text-lg font-extrabold text-white">
                    100% Live
                  </p>
                  <p className="text-[11px] text-orange-200/75">
                    Verified attendance &amp; ratings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-wide py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                <Heart key="heart" size={18} />,
                "People before performance",
                "Everyone deserves to be seen, supported, and challenged at the right level.",
              ],
              [
                <Target key="target" size={18} />,
                "Progress over pressure",
                "We value steady improvement and the habits behind it, not just the final score.",
              ],
              [
                <UsersRound key="team" size={18} />,
                "Better together",
                "A positive team culture makes training a place you want to come back to.",
              ],
            ].map(([icon, title, copy]) => (
              <article key={title} className="surface-card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-orange-200/80 bg-orange-50 text-orange-600">
                  {icon}
                </span>
                <h2 className="mt-4 text-base font-bold text-gray-900">
                  {title}
                </h2>
                <p className="mt-2 text-xs leading-6 text-stone-600">{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
