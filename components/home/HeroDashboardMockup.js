"use client";

import { useState } from "react";
import {
  Activity,
  Award,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Flame,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { CountUp } from "@/components/ui/ScrollReveal";

const months = [
  { label: "Feb", attendance: 84, skill: 68 },
  { label: "Mar", attendance: 88, skill: 74 },
  { label: "Apr", attendance: 91, skill: 79 },
  { label: "May", attendance: 94, skill: 85 },
  { label: "Jun", attendance: 96, skill: 90 },
  { label: "Jul", attendance: 98, skill: 94 },
];

const liveSessions = [
  {
    sport: "Cricket · U-19 Pace & Batting",
    coach: "Coach Arjun Menon",
    time: "Today, 4:30 PM",
    status: "Checked In",
    tone: "emerald",
  },
  {
    sport: "Football · Tactical Midfield",
    coach: "Coach Dev Sharma",
    time: "Tomorrow, 6:00 AM",
    status: "Scheduled",
    tone: "orange",
  },
  {
    sport: "Strength & Agility Assessment",
    coach: "Coach Kavya Rao",
    time: "Fri, 5:00 PM",
    status: "Milestone Review",
    tone: "amber",
  },
];

export default function HeroDashboardMockup() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="relative z-20 mx-auto mt-6 max-w-6xl px-2 sm:mt-10 sm:px-4">
      {/* Ambient Radial Orange Glow Behind Browser Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 -top-10 bottom-10 -z-10 bg-[radial-gradient(ellipse_55%_55%_at_50%_20%,rgba(249,115,22,0.18),transparent_70%)] blur-2xl"
      />

      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-lift ring-1 ring-black/[0.03]">
        {/* Browser Chrome Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-stone-100/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-2 hidden items-center gap-2 rounded-lg border border-stone-200/80 bg-white px-3 py-1 text-xs font-medium text-stone-500 shadow-2xs sm:flex">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>sportivo.academy/dashboard/athlete</span>
            </div>
          </div>

          {/* Interactive View Switcher Pills inside Mockup */}
          <div className="flex items-center gap-1 rounded-full border border-stone-200/80 bg-white/90 p-1 text-xs font-semibold">
            {[
              ["overview", "Athlete Overview"],
              ["progress", "Skill Analytics"],
              ["schedule", "Cohort Feed"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`rounded-full px-3 py-1 transition-all duration-200 ${
                  activeTab === id
                    ? "bg-orange-600 text-white shadow-xs"
                    : "text-stone-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Body */}
        <div className="grid lg:grid-cols-[210px_1fr]">
          {/* Left Sidebar inside Mockup */}
          <aside className="hidden border-r border-stone-200/70 bg-[#FAF7F2]/70 p-4 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-2.5 px-2 py-1.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange-600 text-xs font-bold text-white">
                  S
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900">Sportivo OS</p>
                  <p className="text-[10px] font-medium text-stone-400">
                    2026 Season
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-1">
                {[
                  [Activity, "Dashboard", "overview"],
                  [TrendingUp, "Skill Progress", "progress"],
                  [CalendarCheck2, "Cohort Schedule", "schedule"],
                ].map(([Icon, label, id]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                      activeTab === id
                        ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200/80"
                        : "text-stone-600 hover:bg-stone-100/80 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={15} className={activeTab === id ? "text-orange-600" : "text-stone-400"} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-amber-50/60 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-800">
                <Flame size={13} className="text-orange-600" />
                <span>14-Session Streak</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-stone-600">
                Top 5% attendance in U-19 Cricket Cohort this month.
              </p>
            </div>
          </aside>

          {/* Main Live Dashboard Area */}
          <div className="p-4 sm:p-6 text-left">
            {/* Top Welcome Row */}
            <div className="flex flex-col justify-between gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Athlete Workspace · ID #SP-2048</span>
                </div>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                  Welcome back, Aarav Sharma
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-700">
                  <Trophy size={13} className="text-orange-600" />
                  Cricket · Pro Cohort
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={13} />
                  Membership Active
                </span>
              </div>
            </div>

            {/* 4 Animated KPI Stat Cards */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-stone-200/80 bg-[#FFFDFB] p-3.5 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>Attendance</span>
                  <CalendarCheck2 size={15} className="text-orange-600" />
                </div>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                  <CountUp end={96.4} decimals={1} suffix="%" />
                </p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                  +4.2% vs last month
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-[#FFFDFB] p-3.5 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>Skill Index</span>
                  <Award size={15} className="text-orange-600" />
                </div>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                  <CountUp end={92} suffix="/100" />
                </p>
                <p className="mt-1 text-[11px] font-semibold text-orange-600">
                  Match-Ready Tier
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-[#FFFDFB] p-3.5 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>Sessions Logged</span>
                  <ClipboardCheck size={15} className="text-orange-600" />
                </div>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                  <CountUp end={48} />
                </p>
                <p className="mt-1 text-[11px] font-medium text-stone-500">
                  1 : 6 small cohort
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-[#FFFDFB] p-3.5 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>Coach Reviews</span>
                  <Sparkles size={15} className="text-orange-600" />
                </div>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                  <CountUp end={12} suffix=" Notes" />
                </p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                  Updated 2h ago
                </p>
              </div>
            </div>

            {/* Bottom Split: 6-Month Trend Chart + Live Cohort Feed */}
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              {/* 6-Month Performance & Attendance Trend */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                      6-Month Performance Trend
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Attendance consistency vs. verified coach skill score
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-semibold">
                    <span className="inline-flex items-center gap-1.5 text-gray-800">
                      <i className="h-2.5 w-2.5 rounded-sm bg-orange-500" />
                      Attendance %
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-stone-600">
                      <i className="h-2.5 w-2.5 rounded-sm bg-gray-900" />
                      Skill Score
                    </span>
                  </div>
                </div>

                {/* Animated Bars */}
                <div className="mt-5 grid grid-cols-6 items-end gap-3 pt-4 h-36 border-b border-stone-200/80 px-2">
                  {months.map((m) => (
                    <div
                      key={m.label}
                      className="group flex flex-col items-center gap-1.5 h-full justify-end"
                    >
                      <div className="flex w-full items-end justify-center gap-1 h-28">
                        <div
                          style={{ height: `${m.attendance}%` }}
                          className="w-3 sm:w-4 rounded-t-md bg-gradient-to-t from-orange-600 to-orange-400 transition-transform duration-300 origin-bottom group-hover:scale-y-105"
                          title={`Attendance: ${m.attendance}%`}
                        />
                        <div
                          style={{ height: `${m.skill}%` }}
                          className="w-3 sm:w-4 rounded-t-md bg-gray-900 transition-transform duration-300 origin-bottom group-hover:scale-y-105"
                          title={`Skill Score: ${m.skill}/100`}
                        />
                      </div>
                      <span className="pb-1.5 text-[11px] font-semibold text-stone-500">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Cohort & Evaluation Feed */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Upcoming & Verified Sessions
                  </h3>
                  <Clock3 size={14} className="text-orange-600" />
                </div>
                <div className="mt-3 space-y-2.5">
                  {liveSessions.map((item) => (
                    <div
                      key={item.sport}
                      className="flex items-center justify-between gap-2 rounded-xl border border-stone-200/70 bg-white p-2.5 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-gray-900">
                          {item.sport}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {item.coach} · {item.time}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          item.tone === "emerald"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.tone === "orange"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
