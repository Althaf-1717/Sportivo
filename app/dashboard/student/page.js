import Link from "next/link";
import { Activity, ArrowRight, CalendarCheck2, CreditCard, Sparkles, Target, Trophy } from "lucide-react";
import { getStudentDashboard } from "@/lib/dashboard-data";
import { currentUser } from "@/lib/server-auth";
import { money, dateLabel } from "@/lib/utils";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { ProgressTrendChart } from "@/components/dashboard/DashboardCharts";
import { getSports, getCoaches, getMembershipPlans } from "@/lib/public-data";
import StudentOnboardingFlow from "@/components/enrollment/StudentOnboardingFlow";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage({ searchParams }) {
  const user = await currentUser();
  const [data, params] = await Promise.all([
    getStudentDashboard(user.id),
    searchParams,
  ]);
  const current = data.currentEnrollment;

  // If the student has NO active enrollment / has not completed payment yet:
  // Render the step-by-step Onboarding Flow (Plan -> Sport -> Coach -> Razorpay QR 5s payment)
  if (!current) {
    const [sports, coaches, plans] = await Promise.all([
      getSports(),
      getCoaches(),
      getMembershipPlans(),
    ]);

    return (
      <StudentOnboardingFlow
        user={user}
        sports={sports}
        coaches={coaches}
        plans={plans}
      />
    );
  }

  // Otherwise, for students who already have successful payment and active membership:
  // Render the full main student dashboard with all student features!
  const progressData = data.progress.slice(0, 7).reverse().map((item, i) => ({
    label: dateLabel(item.createdAt, { month: "short", day: "numeric" }),
    progress: item.overallProgress || 0,
    index: i,
  }));
  const salutation = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {params?.congratulations === "1" && (
        <div className="mb-6 rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Trophy size={20} className="animate-float" />
            </span>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Congratulations, {user.name}! Your membership is active!
              </h3>
              <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                Welcome to Sportivo Academy! Your enrolled program for{" "}
                <strong className="font-bold">{current.sport?.name}</strong> with{" "}
                <strong className="font-bold">Coach {current.coach?.name}</strong> is now live.
                All student features — <strong>Coaches</strong>, <strong>Attendance</strong>, <strong>Progress</strong>, and <strong>Payments</strong> — are now unlocked in your sidebar navigation.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-lg bg-emerald-200/70 px-2.5 py-1 font-semibold text-emerald-900">
                  Student ID: #{user.studentId || 10001}
                </span>
                <span className="rounded-lg bg-emerald-200/70 px-2.5 py-1 font-semibold text-emerald-900">
                  Plan: {current.membershipPlan?.name}
                </span>
                <span className="rounded-lg bg-emerald-200/70 px-2.5 py-1 font-semibold text-emerald-900">
                  Total Classes: {current.membershipPlan?.duration === 1 ? 30 : current.membershipPlan?.duration === 3 ? 90 : 180} Days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{salutation}, {user.name?.split(" ")[0]}</p>
          <h2 className="mt-1 text-[24px] font-bold tracking-[-.045em] text-navy sm:text-[28px]">
            Ready for what’s next?
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Your training, progress, and next steps — all in one place.
          </p>
        </div>
        <span className="pill w-fit">
          Training {current.sport?.name || "at Sportivo"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Attendance"
          value={`${data.summary.attendanceRate}%`}
          note={`${data.summary.presentSessions} of ${data.summary.totalSessions} recorded sessions`}
        />
        <StatCard
          icon={Target}
          label="Overall progress"
          value={`${data.summary.progress}%`}
          note={`Current level · ${data.summary.skillLevel}`}
          tone="orange"
        />
        <StatCard
          icon={Trophy}
          label="Your sport"
          value={current?.sport?.name || "Not enrolled"}
          note={current?.coach?.name ? `Coach ${current.coach.name}` : "Choose a sport and find your coach"}
          tone="green"
        />
        <StatCard
          icon={CalendarCheck2}
          label="Membership"
          value={current?.membershipPlan?.name || "Active"}
          note={`Until ${dateLabel(current.endDate)}`}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">The long game</p>
              <h3 className="mt-1 text-sm font-bold text-navy">Progress over time</h3>
            </div>
            <span className="rounded-lg bg-blue-soft px-2.5 py-1 text-[9px] font-bold text-blue">
              Your coach’s check-ins
            </span>
          </div>
          {data.progress.length ? (
            <div className="mt-5">
              <ProgressTrendChart data={progressData} />
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                title="Your progress story starts here."
                description="Once your coach adds a skill review, you’ll see it build over time."
              />
            </div>
          )}
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">Good to know</p>
              <h3 className="mt-1 text-sm font-bold text-navy">Membership snapshot</h3>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange/10 text-orange">
              <CreditCard size={16} />
            </span>
          </div>
          <div className="mt-5 rounded-xl bg-paper p-4">
            <p className="text-[10px] font-semibold text-slate-500">{current?.membershipPlan?.name}</p>
            <p className="mt-1 text-lg font-bold text-navy">{money(current?.membershipPlan?.price)}</p>
            <p className="mt-1 text-[10px] text-slate-500">
              {current?.membershipPlan?.duration} month plan · expires {dateLabel(current.endDate)}
            </p>
          </div>
          <Link
            href="/dashboard/student/membership"
            className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-blue"
          >
            View membership <ArrowRight size={13} />
          </Link>
          <div className="mt-5 rounded-xl border border-orange/15 bg-orange/5 p-4">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-navy">
              <Sparkles size={13} className="text-orange" /> Keep showing up
            </span>
            <p className="mt-1.5 text-[10px] leading-5 text-slate-500">
              A little consistency goes a long way. Your next session is a fresh chance to improve.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">Recent attendance</h3>
            <Link href="/dashboard/student/attendance" className="text-[10px] font-bold text-blue">
              View all
            </Link>
          </div>
          {data.attendance.length ? (
            <div className="mt-4 grid gap-2">
              {data.attendance.slice(0, 4).map((row) => (
                <div key={row._id} className="flex items-center justify-between rounded-xl bg-paper px-3.5 py-3">
                  <div>
                    <p className="text-[11px] font-semibold text-navy">{row.sport?.name || "Training session"}</p>
                    <p className="mt-1 text-[9px] text-slate-500">{dateLabel(row.date)}</p>
                  </div>
                  <span className={row.status === "present" ? "status-good" : "status-warn"}>{row.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No sessions logged yet."
                description="Your attendance history will appear after your first session."
              />
            </div>
          )}
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">Latest coach note</h3>
            <Link href="/dashboard/student/progress" className="text-[10px] font-bold text-blue">
              See progress
            </Link>
          </div>
          {data.progress[0] ? (
            <div className="mt-4 rounded-xl bg-paper p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">
                  {dateLabel(data.progress[0].createdAt)}
                </span>
                <span className="status-good">{data.progress[0].skillLevel}</span>
              </div>
              <p className="mt-3 text-xs font-semibold text-navy">
                {data.progress[0].remarks || "Keep building on the fundamentals."}
              </p>
              <p className="mt-2 text-[10px] leading-5 text-slate-500">
                {data.progress[0].trainingNotes || "Your coach will add practice notes here."}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="Your first review is on its way."
                description="Coach feedback and training notes live here."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
