import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { CalendarCheck2, Target, WalletCards } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";
import { connectDB } from "@/lib/mongodb";
import { Attendance, Enrollment, Payment, Progress, User } from "@/models";
import { currentUser } from "@/lib/server-auth";
import { dateLabel, money } from "@/lib/utils";

export const dynamic = "force-dynamic";
export async function generateMetadata() { return { title: "Student profile", robots: { index: false } }; }

export default async function StudentDetailsPage({ params }) {
  const viewer = await currentUser();
  if (!viewer || !["coach", "admin"].includes(viewer.role)) redirect("/login");
  const { studentId } = await params;
  await connectDB();
  const student = await User.findOne({ _id: studentId, role: "student" }).select("name email phone image isActive createdAt").lean();
  if (!student) notFound();
  if (viewer.role === "coach" && !await Enrollment.exists({ student: studentId, coach: viewer.id, status: "active" })) redirect("/dashboard/coach/students");
  const [enrollments, attendance, progress, payments] = await Promise.all([
    Enrollment.find({ student: studentId }).sort({ createdAt: -1 }).populate("sport", "name").populate("coach", "name").populate("membershipPlan", "name duration price").lean(),
    Attendance.find({ student: studentId }).sort({ date: -1 }).limit(8).populate("sport", "name").lean(),
    Progress.find({ student: studentId }).sort({ createdAt: -1 }).limit(6).populate("sport", "name").lean(),
    Payment.find({ student: studentId }).sort({ createdAt: -1 }).limit(6).populate("membershipPlan", "name").lean(),
  ]);
  return <main className="min-h-screen bg-paper px-4 py-8 sm:px-6"><div className="mx-auto max-w-5xl"><PageIntro eyebrow="Private student record" title={student.name} description={`${student.email} · Account ${student.isActive ? "active" : "disabled"}`} /><div className="grid gap-4 lg:grid-cols-2"><section className="surface-card p-5"><h2 className="text-sm font-bold text-navy">Memberships</h2>{enrollments.length ? enrollments.map((item) => <div key={item._id} className="mt-3 rounded-xl bg-paper p-3"><p className="text-xs font-semibold text-navy">{item.sport?.name} · {item.membershipPlan?.name}</p><p className="mt-1 text-[10px] text-slate-500">Coach {item.coach?.name} · {dateLabel(item.startDate)} – {dateLabel(item.endDate)}</p></div>) : <p className="mt-3 text-xs text-slate-500">No enrolments yet.</p>}</section><section className="surface-card p-5"><h2 className="text-sm font-bold text-navy">Recent attendance</h2>{attendance.length ? attendance.map((item) => <div key={item._id} className="mt-3 flex items-center justify-between rounded-xl bg-paper p-3"><span className="text-[10px] text-slate-600">{item.sport?.name} · {dateLabel(item.date)}</span><span className={item.status === "present" ? "status-good" : "status-warn"}>{item.status}</span></div>) : <p className="mt-3 text-xs text-slate-500">No attendance history.</p>}</section><section className="surface-card p-5"><div className="flex items-center gap-2"><Target size={15} className="text-blue" /><h2 className="text-sm font-bold text-navy">Progress notes</h2></div>{progress.length ? progress.map((item) => <div key={item._id} className="mt-3 rounded-xl bg-paper p-3"><p className="text-[10px] font-semibold text-navy">{item.skillLevel} · {item.overallProgress}%</p><p className="mt-1 text-[10px] leading-5 text-slate-500">{item.remarks || item.trainingNotes}</p></div>) : <p className="mt-3 text-xs text-slate-500">No coach reviews yet.</p>}</section><section className="surface-card p-5"><div className="flex items-center gap-2"><WalletCards size={15} className="text-blue" /><h2 className="text-sm font-bold text-navy">Payments</h2></div>{payments.length ? payments.map((item) => <div key={item._id} className="mt-3 flex items-center justify-between rounded-xl bg-paper p-3"><span className="text-[10px] text-slate-600">{item.membershipPlan?.name} · {dateLabel(item.createdAt)}</span><span className="text-[10px] font-semibold text-navy">{money(item.amount)} · {item.status}</span></div>) : <p className="mt-3 text-xs text-slate-500">No payments yet.</p>}</section></div><div className="mt-5 flex items-center gap-2 text-[10px] text-slate-400"><CalendarCheck2 size={13} /> Coach and admin access is logged through the authenticated account session.</div></div></main>;
}
