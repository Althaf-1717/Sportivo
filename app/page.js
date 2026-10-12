import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
  Award,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import SportCard from "@/components/sports/SportCard";
import CoachCard from "@/components/coaches/CoachCard";
import MembershipCard from "@/components/membership/MembershipCard";
import HeroDashboardMockup from "@/components/home/HeroDashboardMockup";
import ProblemSolutionSection from "@/components/home/ProblemSolutionSection";
import ScrollStorytelling from "@/components/home/ScrollStorytelling";
import FaqAccordion from "@/components/home/FaqAccordion";
import { ScrollReveal, CountUp } from "@/components/ui/ScrollReveal";
import { getSports, getCoaches, getMembershipPlans } from "@/lib/public-data";

export const revalidate = 300;

export default async function HomePage() {
  const [sports, coaches, plans] = await Promise.all([
    getSports(),
    getCoaches(),
    getMembershipPlans(),
  ]);
  const featuredCoaches = coaches.slice(0, 3);
  const featuredPlans = plans
    .filter(
      (plan, index, list) =>
        list.findIndex((candidate) => candidate.name === plan.name) === index
    )
    .slice(0, 3);

  return (
    <PublicLayout>
      <main className="relative z-10 overflow-x-clip">
        {/* 1. HERO SECTION (Clienter-Inspired Centered Headline + Dual CTAs + Trust Row + Live Product Mockup) */}
        <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <ScrollReveal>
              <Link
                href="/sports"
                className="group mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-orange-50/85 py-1.5 pl-3 pr-4 text-xs sm:text-sm font-semibold text-orange-800 shadow-2xs backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-[0_10px_28px_-12px_rgba(249,115,22,0.5)]"
              >
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  <Sparkles size={11} /> New
                </span>
                <span>2026 Athletic Season — Enrolment & Trial Sessions Open</span>
                <ArrowRight
                  size={14}
                  className="-translate-x-0.5 text-orange-600 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-6xl lg:text-[68px]">
                The coaching &amp; progress system{" "}
                <br className="hidden sm:block" />
                that elevates your{" "}
                <span className="text-gradient-brand italic font-extrabold drop-shadow-[0_2px_20px_rgba(249,115,22,0.22)]">
                  game
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-stone-600 sm:text-base">
                One academy for specialist coaching, 1 : 6 small-group cohorts, live digital attendance, verified skill evaluations, and season memberships across Cricket, Football, and Basketball in Bengaluru.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={220}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link
                  href="/register"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-[0_12px_34px_-12px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_18px_44px_-12px_rgba(249,115,22,0.55)] sm:w-auto"
                >
                  <span>Start training</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#storytelling"
                  className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full border border-stone-200/90 bg-white/80 px-7 py-4 text-base font-semibold text-gray-800 shadow-2xs backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:text-orange-700 hover:shadow-[0_14px_36px_-14px_rgba(249,115,22,0.45)] sm:w-auto"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white">
                    <Play size={11} className="translate-x-[0.5px] fill-current" />
                  </span>
                  <span>See how it works</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Trust-Badge Row */}
            <ScrollReveal delay={290}>
              <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm font-medium text-stone-600">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-orange-600" />
                  Certified Pro Coaches
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={16} className="text-orange-600" />
                  Strict 1 : 6 Cohort Ratio
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Activity size={16} className="text-orange-600" />
                  Live Attendance &amp; Skill Portal
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-orange-600" />
                  Flexible Season Plans
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Realistic Interactive Live Dashboard Mockup */}
          <ScrollReveal delay={200}>
            <HeroDashboardMockup />
          </ScrollReveal>
        </section>

        {/* 2. ANIMATED NUMBER COUNT-UPS STRIP */}
        <section className="border-y border-stone-200/80 bg-white/75 backdrop-blur-md">
          <div className="container-wide grid grid-cols-2 divide-x divide-y divide-stone-200/60 py-4 sm:py-6 md:grid-cols-4 md:divide-y-0">
            {[
              { end: 500, suffix: "+", label: "Active Athletes", sub: "Training across Bengaluru" },
              { end: 96, suffix: "%", label: "Attendance Rate", sub: "Verified digital check-ins" },
              { end: 6, prefix: "1 : ", suffix: "", label: "Coach Ratio", sub: "Small-group personal focus" },
              { end: 100, suffix: "%", label: "Skill Tracking", sub: "Live coach evaluations" },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-4 text-center sm:px-6">
                <p className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  <CountUp
                    end={stat.end}
                    prefix={stat.prefix || ""}
                    suffix={stat.suffix || ""}
                  />
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-orange-600">
                  {stat.label}
                </p>
                <p className="mt-0.5 hidden text-[11px] text-stone-500 sm:block">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. INFINITE MARQUEE + PROBLEM VS. SOLUTION COMPARISON */}
        <ProblemSolutionSection />

        {/* 4. STICKY 5-ACT SCROLL STORYTELLING SECTION */}
        <ScrollStorytelling />

        {/* 5. SPORTS PROGRAMMES GRID */}
        <section id="sports" className="container-wide py-20 sm:py-24">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Find your discipline</span>
              <h2 className="section-title mt-2">
                Three sports. One{" "}
                <span className="text-gradient-brand italic">standard</span>.
              </h2>
              <p className="section-copy mt-3 max-w-xl">
                Every programme combines turf drills, match simulation, and digital skill milestones tailored to your level.
              </p>
            </div>
            <Link
              href="/sports"
              className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-2xs transition hover:border-orange-300 hover:text-orange-600"
            >
              <span>View all sports</span>
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sports.slice(0, 3).map((sport, i) => (
              <ScrollReveal key={sport.slug || sport._id} delay={i * 90}>
                <SportCard sport={sport} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 6. FEATURE HIGHLIGHTS WITH MOCK UI CARDS */}
        <section className="py-20 sm:py-24">
          <div className="container-wide">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">Built-in clarity</span>
              <h2 className="section-title mt-2">
                Turn every training session into{" "}
                <span className="text-gradient-brand italic">
                  verified progress
                </span>
              </h2>
              <p className="section-copy mx-auto mt-3 max-w-2xl">
                Consistency is the hardest thing for an developing athlete to build — so Sportivo builds the system around you.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ShieldCheck,
                  badge: "1 : 6 Max",
                  title: "Small-Cohort Coaching",
                  body: "Capped training groups ensure every athlete gets high-rep drills and immediate technical correction.",
                  mockLabel: "Cohort Capacity",
                  mockValue: "6 / 6 Athletes Active",
                },
                {
                  icon: Activity,
                  badge: "Real-Time",
                  title: "Verified Skill Ratings",
                  body: "Coaches grade technique, footwork, and match awareness after assessments so growth is never a mystery.",
                  mockLabel: "Latest Evaluation",
                  mockValue: "92/100 · Match-Ready",
                },
                {
                  icon: Users,
                  badge: "3 Portals",
                  title: "Connected Ecosystem",
                  body: "Dedicated dashboards for Athletes, Coaches, and Academy Admins keep everyone aligned in one login.",
                  mockLabel: "Portal Status",
                  mockValue: "Synced Across Devices",
                },
                {
                  icon: Clock3,
                  badge: "Flexible",
                  title: "Built for Real Schedules",
                  body: "Morning and evening turf slots designed to fit seamlessly around school, college, and exams.",
                  mockLabel: "Next Turf Slot",
                  mockValue: "Today · 4:30 PM IST",
                },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <ScrollReveal key={feat.title} delay={idx * 80}>
                    <div className="surface-card flex h-full flex-col justify-between p-6 hover:-translate-y-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-orange-200/80 bg-orange-50 text-orange-600">
                            <Icon size={20} />
                          </span>
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                            {feat.badge}
                          </span>
                        </div>
                        <h3 className="mt-5 text-base font-bold text-gray-900">
                          {feat.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-stone-600">
                          {feat.body}
                        </p>
                      </div>

                      {/* Mini Mock UI Sub-Card */}
                      <div className="mt-5 rounded-xl border border-stone-200/80 bg-[#FAF7F2] px-3.5 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                          {feat.mockLabel}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-gray-900">
                          {feat.mockValue}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. COACHING TEAM SHOWCASE */}
        <section className="container-wide py-20 sm:py-24">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">People who make a difference</span>
              <h2 className="section-title mt-2">
                Meet your{" "}
                <span className="text-gradient-brand italic">specialist</span>{" "}
                coaches.
              </h2>
              <p className="section-copy mt-3 max-w-xl">
                Accredited mentors with competitive playing backgrounds who know how to bring out your best game.
              </p>
            </div>
            <Link
              href="/coaches"
              className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-2xs transition hover:border-orange-300 hover:text-orange-600"
            >
              <span>Meet every coach</span>
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCoaches.map((coach, i) => (
              <ScrollReveal key={coach.slug || coach._id} delay={i * 90}>
                <CoachCard coach={coach} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 8. PRICING / MEMBERSHIP PLANS */}
        <section className="py-20 sm:py-24">
          <div className="container-wide">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Membership plans</span>
              <h2 className="section-title mt-2">
                Simple,{" "}
                <span className="text-gradient-brand italic">honest</span>{" "}
                season plans
              </h2>
              <p className="section-copy mt-3">
                Choose the training pace that fits your season. Every plan includes specialist coaching and full portal access.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featuredPlans.map((plan, i) => (
                <ScrollReveal key={plan.slug || plan._id} delay={i * 90}>
                  <MembershipCard plan={plan} featured={i === 1} index={i} />
                </ScrollReveal>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-stone-500">
              Plans are available for Cricket, Football, and Basketball. Select your sport during enrolment.
            </p>
          </div>
        </section>

        {/* 9. INTERACTIVE FAQ ACCORDION */}
        <FaqAccordion />

        {/* 10. BOLD CLOSING CTA (Clienter Espresso Dark + Ember Glow Style) */}
        <section className="container-wide pb-20 sm:pb-28">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[32px] bg-[#1c1411] px-6 py-14 text-center text-white shadow-[0_32px_80px_-20px_rgba(28,20,17,0.65)] sm:px-12 sm:py-20">
              {/* Warm Ember Radial Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.28),transparent_70%)] blur-2xl"
              />

              <div className="relative z-10 mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-orange-300 backdrop-blur">
                  <ShieldCheck size={14} className="text-orange-400" />
                  2026 Season · Open Enrolment
                </span>

                <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.12]">
                  Start building your game the{" "}
                  <span className="text-gradient-brand italic font-bold">
                    focused
                  </span>{" "}
                  way
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-stone-300">
                  Create your athlete account, pick your sport, and join a 1 : 6 cohort coached by specialists in minutes.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                  <Link
                    href="/register"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-8 py-4 text-base font-semibold text-white shadow-[0_14px_34px_-8px_rgba(234,88,12,0.65)] transition-all hover:brightness-110 sm:w-auto"
                  >
                    <span>Join Sportivo</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-stone-200 transition-colors hover:border-white/40 hover:bg-white/[0.06] sm:w-auto"
                  >
                    Sign in to portal
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </PublicLayout>
  );
}
