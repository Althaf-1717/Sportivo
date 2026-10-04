import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const colors = ["bg-blue-soft text-blue", "bg-orange/10 text-orange", "bg-emerald-50 text-emerald-700", "bg-violet-50 text-violet-700"];

export default function CoachCard({ coach, index = 0 }) {
  const name = coach.user?.name || coach.name || "Academy coach";
  const slug = coach.slug || coach._id;
  const sport = coach.specialization || coach.sport || "Player development";
  return (
    <Link href={`/coaches/${slug}`} className="group surface-card flex h-full flex-col p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(11,31,58,.1)]">
      <div className="flex items-start justify-between">
      {coach.image || coach.user?.image ? (
        <img
          src={coach.image || coach.user?.image}
          alt={name}
          className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
        />
      ) : (
        <div className={`grid h-14 w-14 place-items-center rounded-2xl text-base font-bold ${colors[index % colors.length]}`}>
          {coach.initials || name.split(" ").map((word) => word[0]).slice(0, 2).join("")}
        </div>
      )}
      <Badge tone="green"><BadgeCheck size={12} className="mr-1" /> Academy coach</Badge>
    </div>
    <h3 className="mt-5 text-base font-bold text-navy">{name}</h3>
    <p className="mt-1 text-[11px] font-semibold text-blue">{coach.role || sport}</p>
    <p className="mt-3 line-clamp-2 flex-1 text-xs leading-6 text-slate-500">{coach.bio || `${coach.experience || "Experienced"} coaching players through focused sessions and thoughtful feedback.`}</p>
    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-500">
      <span>{coach.experience ? `${coach.experience} experience` : "Small-group coaching"}</span>
      <ArrowUpRight size={14} className="text-blue transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </div>
  </Link>
);
}
