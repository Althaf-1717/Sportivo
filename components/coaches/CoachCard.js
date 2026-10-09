import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const colors = ["bg-blue-soft text-blue", "bg-orange/10 text-orange", "bg-emerald-50 text-emerald-700", "bg-violet-50 text-violet-700"];

export default function CoachCard({ coach, index = 0 }) {
  const name = coach.user?.name || coach.name || "Academy coach";
  const slug = coach.slug || coach._id;
  const sport = coach.specialization || coach.sport || "Player development";
  return (
    <Link
      href={`/coaches/${slug}`}
      className="group surface-card flex h-full flex-col p-5 transition duration-300 hover:-translate-y-1.5 hover:border-orange/30 hover:shadow-[0_16px_40px_rgba(7,11,20,.1)]"
    >
      <div className="flex items-start justify-between">
        {coach.image || coach.user?.image ? (
          <div className="relative">
            <img
              src={coach.image || coach.user?.image}
              alt={name}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 group-hover:ring-orange/40"
            />
          </div>
        ) : (
          <div className={`grid h-14 w-14 place-items-center rounded-2xl text-base font-bold shadow-2xs ${colors[index % colors.length]}`}>
            {coach.initials || name.split(" ").map((word) => word[0]).slice(0, 2).join("")}
          </div>
        )}
        <Badge tone="green"><BadgeCheck size={12} /> Pro Coach</Badge>
      </div>
      <h3 className="mt-4 text-base font-bold text-navy transition duration-200 group-hover:text-orange">{name}</h3>
      <p className="mt-0.5 text-[11px] font-extrabold text-blue uppercase tracking-wider">{coach.role || sport}</p>
      <p className="mt-3 line-clamp-2 flex-1 text-xs leading-6 text-slate-500 font-normal">
        {coach.bio || `${coach.experience || "Experienced"} coaching athletes through structured technique and dedicated drills.`}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5 text-[10.5px] font-medium text-slate-400">
        <span className="font-semibold text-slate-600">{coach.experience ? `${coach.experience} yrs coaching experience` : "Small-group cohort"}</span>
        <ArrowUpRight size={14} className="text-orange transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
