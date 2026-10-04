import { Activity, Dumbbell, Gauge, Target } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { ProgressTrendChart } from "@/components/dashboard/DashboardCharts";
import { currentUser } from "@/lib/server-auth";
import { getStudentDashboard } from "@/lib/dashboard-data";
import { dateLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StudentProgressPage() {
  const user = await currentUser();
  const data = await getStudentDashboard(user.id);
  const latest = data.progress[0];
  const trend = [...data.progress].reverse().map((item) => ({ label: dateLabel(item.createdAt, { month: "short", day: "numeric" }), progress: item.overallProgress }));
  return <div><PageIntro eyebrow="Small wins add up" title="Your progress" description="Coach reviews help you see your skills improving and choose what to work on next." />
    {latest && <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Gauge} label="Overall progress" value={`${latest.overallProgress}%`} note="Across fitness, technique, and performance" tone="orange" /><StatCard icon={Dumbbell} label="Fitness" value={`${latest.fitnessScore}%`} note="Movement and conditioning" /><StatCard icon={Target} label="Technical" value={`${latest.technicalScore}%`} note="Sport-specific skills" tone="green" /><StatCard icon={Activity} label="Performance" value={`${latest.performanceScore}%`} note="Applying skills in play" /></div>}
    <div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]"><section className="surface-card p-5 sm:p-6"><h3 className="text-sm font-bold text-navy">Progress over time</h3>{trend.length ? <div className="mt-4"><ProgressTrendChart data={trend} /></div> : <div className="mt-4"><EmptyState title="No reviews yet." description="Your coach will add the first review after they get to know your game." /></div>}</section><section className="surface-card p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">Current level</p><h3 className="mt-2 text-xl font-bold text-navy">{latest?.skillLevel || "Getting started"}</h3><p className="mt-2 text-[11px] leading-6 text-slate-500">Skill levels are based on coach reviews, training consistency, and how comfortably you use your skills in play.</p>{latest && <div className="mt-5 rounded-xl bg-paper p-4"><p className="text-[10px] font-bold text-navy">A note from your coach</p><p className="mt-2 text-[11px] leading-5 text-slate-600">{latest.remarks || "Keep putting in the work. Progress comes one session at a time."}</p>{latest.trainingNotes && <p className="mt-2 border-t border-slate-200 pt-2 text-[10px] leading-5 text-slate-500">{latest.trainingNotes}</p>}</div>}</section></div>
    <section className="mt-5"><h3 className="mb-3 text-sm font-bold text-navy">Past reviews</h3>{data.progress.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Date</th><th>Skill level</th><th>Fitness</th><th>Technical</th><th>Performance</th><th>Overall</th></tr></thead><tbody>{data.progress.map((row) => <tr key={row._id}><td>{dateLabel(row.createdAt)}</td><td>{row.skillLevel}</td><td>{row.fitnessScore}%</td><td>{row.technicalScore}%</td><td>{row.performanceScore}%</td><td><b>{row.overallProgress}%</b></td></tr>)}</tbody></table></div> : <EmptyState title="Your progress story starts here." description="Your coach will record your skill review here." />}</section>
  </div>;
}
