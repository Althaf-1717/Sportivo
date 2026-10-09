import { Card } from "@/components/ui/Card";

export default function StatCard({ icon: Icon, label, value, note, tone = "blue" }) {
  const toneClass =
    tone === "orange"
      ? "bg-orange/10 text-orange ring-1 ring-orange/20"
      : tone === "green"
      ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
      : "bg-blue-soft text-blue ring-1 ring-blue/20";

  return (
    <Card className="group relative overflow-hidden p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white">
      {/* Specular edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80" />

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-[26px] font-black leading-none tracking-tight text-navy">{value}</p>
        </div>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${toneClass}`}>
          <Icon size={18} />
        </span>
      </div>
      {note && (
        <p className="mt-3 text-[10px] font-medium leading-4 text-slate-500">{note}</p>
      )}
    </Card>
  );
}
