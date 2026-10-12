import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import SportIcon from "@/components/ui/SportIcon";

function getMatchedSportImage(sport) {
  const key = `${sport?.slug || ""} ${sport?.name || ""}`.toLowerCase();
  if (key.includes("cricket")) return "/images/sport-cricket.jpg";
  if (key.includes("football") || key.includes("soccer"))
    return "/images/sport-football.jpg";
  if (key.includes("basketball")) return "/images/sport-basketball.jpg";
  if (
    sport?.image &&
    !sport.image.includes("unsplash.com") &&
    !sport.image.includes("hero-football")
  ) {
    return sport.image;
  }
  return "/images/sport-cricket.jpg";
}

function getSportTag(sport) {
  const key = `${sport?.slug || ""} ${sport?.name || ""}`.toLowerCase();
  if (key.includes("cricket")) return "Batting · Pace · Spin";
  if (key.includes("football")) return "First-Touch · Tactical 5v5";
  if (key.includes("basketball")) return "Shooting · Court Agility";
  return "Specialist Coaching";
}

export default function SportCard({ sport, index = 0 }) {
  const image = getMatchedSportImage(sport);
  const tag = getSportTag(sport);

  return (
    <Link
      href={`/sports/${sport.slug || sport._id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_16px_44px_-14px_rgba(28,25,23,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-[0_24px_60px_-14px_rgba(234,88,12,0.18)]"
    >
      {/* Golden-Hour Matched Sport Photography Header */}
      <div className="relative h-56 overflow-hidden bg-stone-900">
        <Image
          src={image}
          alt={`${sport.name} training at Sportivo`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Warm Sunset Amber/Espresso Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#19110d]/85 via-[#19110d]/25 to-orange-950/15" />

        {/* Top Badges */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-100 backdrop-blur-md">
            <Sparkles size={11} className="text-orange-400" />
            {tag}
          </span>
          <span className="rounded-full border border-white/85 bg-white/95 px-3 py-1 text-[11px] font-bold text-gray-900 shadow-xs backdrop-blur-md">
            1 : 6 Cohort
          </span>
        </div>

        {/* Bottom Sport Emblem + Live Status */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/90 bg-white/95 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            <SportIcon
              sport={sport.name || sport.slug || index}
              className="h-6 w-6"
              floating={false}
            />
          </div>
          <span className="rounded-full border border-orange-300/40 bg-orange-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
            2026 Season Open
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-orange-600">
              {sport.name} Academy
            </h3>
            <span className="rounded-full border border-orange-200/70 bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-600">
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
