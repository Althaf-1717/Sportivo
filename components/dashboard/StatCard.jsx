import { Card } from "@/components/ui/Card";

export default function StatCard({ icon: Icon, label, value, note, tone = "blue" }) {
  const toneClass = tone === "orange" ? "bg-orange/10 text-orange" : tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-blue-soft text-blue";
  return <Card className="p-4 sm:p-5"><div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-semibold text-slate-500">{label}</p><p className="mt-2 text-[24px] font-bold leading-none tracking-[-.05em] text-navy">{value}</p></div><span className={`grid h-9 w-9 place-items-center rounded-xl ${toneClass}`}><Icon size={16} /></span></div><p className="mt-3 text-[9px] leading-4 text-slate-400">{note}</p></Card>;
}
