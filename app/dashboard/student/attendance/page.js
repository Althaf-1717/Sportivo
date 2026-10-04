import Link from "next/link";
import { MessageSquare, User } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { currentUser } from "@/lib/server-auth";
import { getStudentDashboard } from "@/lib/dashboard-data";
import { dateLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StudentAttendancePage() {
  const user = await currentUser();
  const data = await getStudentDashboard(user.id);
  const current = data.currentEnrollment;

  // Total classes calculation based on plan (1 month = 30, 3 months = 90, premium / 6 months = 180)
  const duration = current?.membershipPlan?.duration || 3;
  const totalClasses = duration === 1 ? 30 : duration === 3 ? 90 : 180;
  const presentCount = data.attendance.filter((item) => item.status === "present").length;
  const sessionsRecorded = data.attendance.length;

  // Attendance rate percentage
  const sessionRate = sessionsRecorded > 0 ? Math.round((presentCount / sessionsRecorded) * 100) : 0;
  const planRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Logo, "Student Attendance", and Message / Profile icons (Image 1) */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy p-1.5 shadow-sm">
            <img src="/images/sportivo-logo.png" alt="Sportivo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-navy sm:text-lg">
              Student Attendance
            </h1>
            <p className="text-[11px] text-slate-400">
              Sportivo Academy · Student ID: <strong className="text-blue">#{user.studentId || 10001}</strong>
            </p>
          </div>
        </div>

        {/* Message and Profile Icons (as highlighted in Image 1 top right) */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link
            href="/dashboard/student/profile"
            title="Messages & Notifications"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-paper px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-navy"
          >
            <MessageSquare size={14} className="text-blue" />
            <span className="hidden sm:inline">Messages</span>
          </Link>
          <Link
            href="/dashboard/student/profile"
            title="Student Profile"
            className="flex items-center gap-1.5 rounded-xl border border-blue/30 bg-blue-soft px-3 py-1.5 text-xs font-bold text-blue transition hover:bg-blue hover:text-white"
          >
            <User size={14} />
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {/* "Your Attendance" Banner Card (Image 1) */}
      <section className="surface-card overflow-hidden p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <p className="eyebrow">Academic & Sports Record</p>
          <h2 className="text-xl font-extrabold text-navy sm:text-2xl mt-0.5">
            Your Attendance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Training in {current?.sport?.name || "your program"} with {current?.coach?.name ? `Coach ${current.coach.name}` : "your assigned coach"}.
          </p>
        </div>

        {/* Attendance stats layout matching Image 1 */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {/* Total Class based on plan: 1 mo = 30, 3 mo = 90, premium = 180 */}
          <div className="rounded-2xl border border-slate-200 bg-paper/60 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total class:
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-navy">{totalClasses}</span>
              <span className="text-xs font-semibold text-slate-500">
                days ({current?.membershipPlan?.name || `${duration} Months Plan`})
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {duration === 1 ? "1 Month Membership" : duration === 3 ? "3 Months Membership" : "Premium 6 Months"}
            </p>
          </div>

          {/* Total Present */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              present:
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700">{presentCount}</span>
              <span className="text-xs font-semibold text-emerald-800">
                sessions attended
              </span>
            </div>
            <p className="mt-2 text-[11px] text-emerald-600">
              Out of {sessionsRecorded} recorded sessions
            </p>
          </div>

          {/* Attendance Rate % */}
          <div className="rounded-2xl border border-blue/20 bg-blue-soft/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue">
              Attendance rate:
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-navy">{sessionRate}%</span>
              <span className="text-xs font-semibold text-blue">
                completion rate
              </span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue transition-all duration-500"
                style={{ width: `${Math.min(sessionRate, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] font-semibold text-slate-500">
              Overall plan: {planRate}% of {totalClasses} total classes
            </p>
          </div>
        </div>
      </section>

      {/* "Session history" Table (Image 1) */}
      <section className="surface-card p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-navy">Session history</h3>
            <p className="text-xs text-slate-500">
              Detailed chronological record of every session, drills covered, and coach feedback.
            </p>
          </div>
          <span className="rounded-lg bg-paper border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
            {data.attendance.length} Sessions Logged
          </span>
        </div>

        {data.attendance.length ? (
          <div className="table-wrap rounded-2xl border border-slate-200 overflow-hidden">
            <table className="data-table">
              <thead className="bg-paper text-slate-600 text-xs">
                <tr>
                  <th className="w-36">Date</th>
                  <th>Work (Today&apos;s Training)</th>
                  <th className="w-28">Time</th>
                  <th className="w-32 text-center">Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.attendance.map((row) => {
                  const isPresent = row.status === "present";
                  return (
                    <tr key={row._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Date */}
                      <td className="font-semibold text-navy text-xs">
                        {dateLabel(row.date, { day: "numeric", month: "short", year: "numeric" })}
                      </td>

                      {/* Work */}
                      <td className="text-xs text-slate-800 font-medium max-w-xs">
                        {row.work || "Core conditioning and sport drills"}
                      </td>

                      {/* Time */}
                      <td className="text-xs text-slate-500 font-mono">
                        {row.time || "06:30 PM"}
                      </td>

                      {/* Status badge matching Image 1: [present] in green box, [Absent] in red box */}
                      <td className="text-center">
                        <span
                          className={`inline-block rounded-lg px-3 py-1 text-xs font-bold uppercase shadow-sm ${
                            isPresent
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {isPresent ? "Present" : "Absent"}
                        </span>
                      </td>

                      {/* Remarks (Coach remarks box) */}
                      <td>
                        <div className="rounded-lg bg-paper/80 border border-slate-200/80 px-3 py-1.5 text-xs text-slate-600 max-w-sm">
                          {row.remarks || "Session completed with coach supervision."}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Your first session is waiting."
            description="Attendance appears here automatically as soon as your coach records your first training session."
          />
        )}
      </section>
    </div>
  );
}
