"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  MoveRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

const acts = [
  {
    roman: "I",
    step: "Act 01 · Enrolment",
    title: "He books a trial & lands in a 1 : 6 cohort",
    subtitle: "8 Jul · 10:15 AM — Sport & batch selection",
    description:
      "Aarav selects Cricket and picks the evening U-19 development slot. Instead of joining a 35-player crowd, Sportivo places him into a 6-athlete squad matched by age and skill tier.",
    url: "sportivo.academy/enrolment/cohort-match",
    metrics: [
      ["Assigned Sport", "Cricket · Pace & Batting"],
      ["Cohort Size", "6 Athletes Max (1 : 6)"],
      ["Training Slot", "Mon · Wed · Fri (4:30 PM)"],
      ["Membership Tier", "Pro Season Plan"],
    ],
    badge: "Cohort Confirmed",
    highlight: "Instant digital onboarding & Student ID #SP-2048 generated.",
  },
  {
    roman: "II",
    step: "Act 02 · Coach Pairing",
    title: "Paired with a certified specialist mentor",
    subtitle: "8 Jul · 11:00 AM — Coach assignment & baseline",
    description:
      "Head Coach Arjun Menon receives Aarav’s profile directly in his Coach Workspace. Before day one on the turf, Aarav’s baseline batting stance and bowling action goals are mapped out.",
    url: "sportivo.academy/dashboard/coach-assignment",
    metrics: [
      ["Lead Specialist", "Coach Arjun Menon (Level-2)"],
      ["Baseline Focus", "Front-foot balance & seam release"],
      ["Fitness Target", "Yo-Yo Test Level 16.5"],
      ["Review Cycle", "Bi-weekly digital evaluation"],
    ],
    badge: "Mentor Assigned",
    highlight: "100% continuity — the same specialist coach guides every session.",
  },
  {
    roman: "III",
    step: "Act 03 · Live Attendance",
    title: "Every ground session & drill logged live",
    subtitle: "24 Jul · 4:32 PM — Real-time attendance & drill log",
    description:
      "No paper registers or lost WhatsApp messages. As Aarav steps onto the net, attendance is marked in one tap along with the exact training drills covered that afternoon.",
    url: "sportivo.academy/dashboard/attendance-log",
    metrics: [
      ["July Attendance", "12 / 12 Sessions Present (100%)"],
      ["Today’s Drill", "New-ball swing defence & yorker execution"],
      ["Net Bowling", "42 deliveries · 88% line accuracy"],
      ["Parent Portal", "Live notification delivered"],
    ],
    badge: "100% Streak",
    highlight: "Both athlete and parents see verified session history in real time.",
  },
  {
    roman: "IV",
    step: "Act 04 · Skill Evaluation",
    title: "Honest feedback turns into measurable growth",
    subtitle: "15 Aug · 6:10 PM — Mid-season progress card",
    description:
      "Coach Arjun logs Aarav’s mid-season evaluation across Technique, Footwork, Game Awareness, and Match Fitness. Every score is plotted so Aarav knows exactly what to sharpen next.",
    url: "sportivo.academy/dashboard/skill-progress",
    metrics: [
      ["Technical Rating", "91 / 100 (+18 pts since July)"],
      ["Match Awareness", "89 / 100 · High composure"],
      ["Sprint & Agility", "94 / 100 · Top of cohort"],
      ["Coach Note", "“Ready for 40-over practice matches.”"],
    ],
    badge: "92/100 Overall",
    highlight: "Transparent digital progress notes you can revisit all season.",
  },
  {
    roman: "V",
    step: "Act 05 · Match-Ready",
    title: "From trial beginner to first-XI squad selection",
    subtitle: "30 Sep · 5:00 PM — Season milestone & verified report",
    description:
      "After 48 structured sessions, Aarav earns his Advanced Tier promotion and is selected for the Sportivo Inter-Academy Championship XI — with his full digital report card attached.",
    url: "sportivo.academy/dashboard/season-milestone",
    metrics: [
      ["Season Status", "Promoted to Advanced Match Squad"],
      ["Sessions Completed", "48 Verified Turf Sessions"],
      ["Attendance Rate", "96.4% Season Consistency"],
      ["Next Chapter", "One-click season renewal active"],
    ],
    badge: "Squad Selected",
    highlight: "One athlete, start to finish — tracked in one calm operating system.",
  },
];

export default function ScrollStorytelling() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    stepRefs.current.forEach((el, index) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        {
          rootMargin: "-35% 0px -45% 0px",
          threshold: 0.05,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const currentAct = acts[activeIndex] || acts[0];

  return (
    <section id="storytelling" className="py-20 sm:py-28">
      <div className="container-wide">
        {/* Section Header (Matching Clienter's "One client, end to end") */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-orange-500/80 to-orange-500/0" />
            <MoveRight size={14} className="text-orange-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-600">
              One athlete, end to end
            </span>
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Meet{" "}
            <span className="text-gradient-brand italic font-bold">
              Aarav Sharma
            </span>
            .
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            A trial session booking on <strong className="font-semibold text-gray-900">8 Jul 2026</strong>. A match-squad selection and a verified 92/100 skill index before the season is out. Five acts, every one a real screen — one athlete, start to finish.
          </p>
        </div>

        {/* Sticky Storytelling Grid */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          {/* Left Column: Scrollable Narrative Steps */}
          <div className="space-y-6 lg:space-y-24 lg:py-8">
            {acts.map((act, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={act.roman}
                  ref={(el) => (stepRefs.current[idx] = el)}
                  onClick={() => setActiveIndex(idx)}
                  className={`cursor-pointer rounded-3xl border p-6 sm:p-7 transition-all duration-300 ${
                    isActive
                      ? "border-orange-300 bg-white shadow-[0_22px_50px_-14px_rgba(234,88,12,0.16)] ring-1 ring-orange-500/15"
                      : "border-stone-200/80 bg-white/60 opacity-70 hover:opacity-100 hover:bg-white/90"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold transition-colors ${
                          isActive
                            ? "bg-orange-600 text-white shadow-sm"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {act.roman}
                      </span>
                      {act.step}
                    </span>
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">
                      {act.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    {act.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-orange-600">
                    {act.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {act.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Live Browser Frame with Roman Progress Indicator */}
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-4">
              {/* Vertical Roman Numeral Progress Track (Desktop) */}
              <div
                aria-hidden="true"
                className="hidden w-10 flex-none select-none flex-col items-center gap-3 lg:flex"
              >
                {acts.map((act, idx) => {
                  const isActive = idx === activeIndex;
                  const isPassed = idx < activeIndex;
                  return (
                    <div key={act.roman} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className="group relative flex items-center justify-center py-1"
                        title={act.title}
                      >
                        <span
                          className={`mr-2 text-xs italic font-bold transition-colors ${
                            isActive
                              ? "text-orange-600"
                              : isPassed
                              ? "text-orange-400"
                              : "text-stone-400"
                          }`}
                        >
                          {act.roman}
                        </span>
                        <span
                          className={`block rounded-full transition-all duration-300 ${
                            isActive
                              ? "h-3.5 w-3.5 bg-orange-500 ring-4 ring-orange-500/20 shadow-[0_0_16px_rgba(234,88,12,0.4)]"
                              : isPassed
                              ? "h-2.5 w-2.5 bg-orange-400"
                              : "h-2 w-2 bg-stone-300"
                          }`}
                        />
                      </button>
                      {idx < acts.length - 1 && (
                        <span
                          className={`mt-2 h-8 w-px transition-colors duration-300 ${
                            isPassed ? "bg-orange-400" : "bg-stone-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sticky Browser Mockup Screen */}
              <div className="flex-1 overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-lift ring-1 ring-black/[0.03]">
                {/* Browser Chrome */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-stone-100/70 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-stone-200/80 bg-white px-3 py-1 text-[11px] font-medium text-stone-500 shadow-2xs">
                    <ShieldCheck size={12} className="text-orange-600" />
                    <span className="truncate">{currentAct.url}</span>
                  </div>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-700">
                    Act {currentAct.roman} / V
                  </span>
                </div>

                {/* Dynamic Screen Content */}
                <div
                  key={currentAct.roman}
                  className="p-6 sm:p-7 transition-all duration-300 animate-in fade-in"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                        {currentAct.step}
                      </span>
                      <h4 className="mt-1 text-lg font-bold text-gray-900">
                        {currentAct.title}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={13} />
                      {currentAct.badge}
                    </span>
                  </div>

                  {/* 4 Key Data Cards Inside Browser Frame */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {currentAct.metrics.map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2]/80 p-4"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          {label}
                        </p>
                        <p className="mt-1.5 text-sm font-bold text-gray-900">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar & Verified Highlight */}
                  <div className="mt-5 rounded-2xl border border-orange-200/80 bg-orange-50/60 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles size={14} className="text-orange-600" />
                        Athlete Journey Progress
                      </span>
                      <span>{(activeIndex + 1) * 20}% Complete</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-orange-200/60">
                      <div
                        style={{
                          transform: `scaleX(${(activeIndex + 1) / 5})`,
                          transformOrigin: "left",
                        }}
                        className="h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-transform duration-500"
                      />
                    </div>
                    <p className="mt-2.5 text-xs font-medium text-stone-600">
                      {currentAct.highlight}
                    </p>
                  </div>

                  {/* Step Pill Selector for Instant Interactive Preview */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-4">
                    <span className="text-[11px] font-semibold text-stone-400">
                      Jump to act:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {acts.map((a, idx) => (
                        <button
                          key={a.roman}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          className={`h-7 rounded-full px-3 text-xs font-bold transition-all ${
                            idx === activeIndex
                              ? "bg-gray-900 text-white shadow-xs"
                              : "bg-stone-100 text-stone-600 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          {a.roman}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
