import { Activity, Banknote, CalendarCheck2, UsersRound, ClipboardCheck, Target, Trophy } from "lucide-react";
import { getAdminDashboard } from "@/lib/dashboard-data";
import StatCard from "@/components/dashboard/StatCard";
import { AttendanceBars, ProgressDistributionChart, RevenueChart, SportMixChart } from "@/components/dashboard/DashboardCharts";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";
const icons = [UsersRound, Trophy, ClipboardCheck, Activity, Banknote, CalendarCheck2, CalendarCheck2, Target];

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  return <div><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow">Academy at a glance</p><h2 className="mt-1 text-[26px] font-bold tracking-[-.05em] text-navy">Operations overview</h2><p className="mt-2 text-xs text-slate-500">A clear picture of what’s happening across Sportivo.</p></div><span className="pill w-fit">Updated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{data.stats.map((stat, i) => <StatCard key={stat.label} icon={icons[i] || Activity} label={stat.label} value={stat.currency ? money(stat.value) : stat.value} note={stat.note} tone={i === 4 ? "orange" : i === 3 ? "green" : "blue"} />)}</div>
    <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_.9fr]"><section className="surface-card p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">Verified revenue</p><h3 className="mt-1 text-sm font-bold text-navy">Monthly performance</h3></div><span className="rounded-lg bg-blue-soft px-2.5 py-1 text-[9px] font-bold text-blue">INR</span></div><div className="mt-4"><RevenueChart data={data.revenue} /></div></section><section className="surface-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">Programme mix</p><h3 className="mt-1 text-sm font-bold text-navy">Enrolments by sport</h3><SportMixChart data={data.sports} /></section></div>
    <div className="mt-4 grid gap-4 xl:grid-cols-2"><section className="surface-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">Showing up</p><h3 className="mt-1 text-sm font-bold text-navy">Attendance trends</h3><div className="mt-4"><AttendanceBars data={data.attendance} /></div><div className="mt-3 flex gap-4 text-[9px] text-slate-500"><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#58A880]" /> Present</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-orange" /> Absent</span></div></section><section className="surface-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">Player development</p><h3 className="mt-1 text-sm font-bold text-navy">Students by skill level</h3><div className="mt-4"><ProgressDistributionChart data={data.progressDistribution} /></div></section></div>
  </div>;
}
