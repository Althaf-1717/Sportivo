import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[var(--surface-shadow)] transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-[var(--surface-shadow-hover)]"
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

        <p className="absolute bottom-5 left-5 text-xs font-medium tracking-wide text-white">{tag}</p>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-medium tracking-tight text-gray-900 transition-colors group-hover:text-orange-600">
              {sport.name} Academy
            </h3>
            <span className="rounded-full border border-orange-200/70 bg-orange-50 px-2.5 py-0.5 text-[11px] font-medium text-orange-600">
              0{index + 1}
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-6 text-stone-600 line-clamp-2">
            {sport.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-medium !text-gray-900 group-hover:!text-orange-600">
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
