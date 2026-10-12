import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, Sparkles } from "lucide-react";
import SportIcon from "@/components/ui/SportIcon";

const sportThemes = {
  cricket: {
    gradient: "from-[#1f140e] via-[#361c0d] to-[#ea580c]",
    accent: "text-orange-300",
    badge: "Batting · Pace · Spin",
    metricLabel: "Pitch Telemetry",
    metricValue: "96.4% Consistency",
    bars: [68, 82, 76, 91, 88, 96],
  },
  football: {
    gradient: "from-[#1c1613] via-[#2e1d12] to-[#d97706]",
    accent: "text-amber-300",
    badge: "First-Touch · Tactical 5v5",
    metricLabel: "Pass Completion",
    metricValue: "94.2% Match Rate",
    bars: [62, 74, 84, 80, 92, 95],
  },
  basketball: {
    gradient: "from-[#22130f] via-[#431a08] to-[#f97316]",
    accent: "text-orange-200",
    badge: "Shooting · Court Agility",
    metricLabel: "Shot Mechanics",
    metricValue: "+22% Arc Precision",
    bars: [58, 70, 79, 86, 90, 97],
  },
};

export default function SportCard({ sport, index = 0 }) {
  const key = (sport.slug || sport.name || "").toLowerCase();
  const theme =
    sportThemes[
      key.includes("cricket")
        ? "cricket"
        : key.includes("football")
        ? "football"
        : "basketball"
    ];

  return (
    <Link
      href={`/sports/${sport.slug || sport._id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_16px_44px_-14px_rgba(28,25,23,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-[0_24px_60px_-14px_rgba(234,88,12,0.18)]"
    >
      {/* Cohesive Warm-Toned Interactive Athletic Telemetry Visual Header */}
      <div
        className={`relative h-56 overflow-hidden bg-gradient-to-br ${theme.gradient} p-5 text-white`}
      >
        {/* Subtle grid pattern matching the main site background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Radial warm glow on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-orange-400/35 blur-2xl transition-transform duration-500 group-hover:scale-125"
        />

        {/* Top Row: Discipline Tag & Cohort Pill */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-100 backdrop-blur-md">
            <Sparkles size={11} className="text-orange-300" />
            {theme.badge}
          </span>
          <span className="rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[11px] font-bold text-gray-900 shadow-xs">
            1 : 6 Cohort
          </span>
        </div>

        {/* Center/Bottom Live Sport UI Telemetry Card + 3D Sport Emblem */}
        <div className="relative z-10 mt-6 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/90 bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
              <SportIcon
                sport={sport.name || sport.slug || index}
                className="h-8 w-8"
                floating={false}
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-200/80">
                {theme.metricLabel}
              </p>
              <p className="mt-0.5 text-sm font-extrabold text-white">
                {theme.metricValue}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                <Activity size={11} /> Live Portal Tracking
              </span>
            </div>
          </div>

          {/* Animated Mini Skill Bar Chart */}
          <div className="flex h-12 items-end gap-1 rounded-xl border border-white/15 bg-black/25 px-2.5 py-2 backdrop-blur-md">
            {theme.bars.map((h, i) => (
              <span
                key={i}
                style={{ height: `${Math.round(h * 0.34)}px` }}
                className="w-1.5 rounded-full bg-gradient-to-t from-orange-500 to-amber-300 transition-all duration-300 group-hover:brightness-125"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-orange-600">
              {sport.name} Academy
            </h3>
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 border border-orange-200/70">
              0{index + 1}
            </span>
          </div>
          <p className="mt-2.5 text-xs leading-6 text-stone-600 line-clamp-2">
            {sport.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-bold !text-gray-900 group-hover:!text-orange-600">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-orange-600" />
            <span>Explore programme &amp; batches</span>
          </span>
          <ArrowRight
            size={15}
            className="text-orange-600 transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
