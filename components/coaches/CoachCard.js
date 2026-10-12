import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

const colors = [
  "bg-orange-50 text-orange-600 border border-orange-200/80",
  "bg-amber-50 text-amber-700 border border-amber-200/80",
  "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
  "bg-stone-100 text-stone-700 border border-stone-200/80",
];

export default function CoachCard({ coach, index = 0 }) {
  const name = coach.user?.name || coach.name || "Academy coach";
  const slug = coach.slug || coach._id;
  const sport = coach.specialization || coach.sport || "Player development";
  return (
    <Link
      href={`/coaches/${slug}`}
      className="group surface-card flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5"
    >
      <div className="flex items-start justify-between">
        {coach.image || coach.user?.image ? (
          <img
            src={coach.image || coach.user?.image}
            alt={name}
            className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-stone-200/90 transition-all duration-300 group-hover:ring-orange-400"
          />
        ) : (
          <div
            className={`grid h-14 w-14 place-items-center rounded-2xl text-base font-bold ${
              colors[index % colors.length]
            }`}
          >
            {coach.initials ||
              name
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
          </div>
        )}
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
          <BadgeCheck size={13} /> Verified Pro
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-orange-600">
        {name}
      </h3>
      <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-600">
        {coach.role || sport}
      </p>
      <p className="mt-3 line-clamp-2 flex-1 text-xs leading-6 text-stone-600">
        {coach.bio ||
          `${
            coach.experience || "Experienced"
          } coaching athletes through structured technique and dedicated drills.`}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-semibold text-stone-600">
        <span>
          {coach.experience
            ? `${coach.experience} yrs coaching experience`
            : "1 : 6 small-group cohort"}
        </span>
        <ArrowRight
          size={15}
          className="text-orange-600 transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
