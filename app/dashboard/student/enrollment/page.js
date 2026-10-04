import PageIntro from "@/components/dashboard/PageIntro";
import StudentOnboardingFlow from "@/components/enrollment/StudentOnboardingFlow";
import { currentUser } from "@/lib/server-auth";
import { getSports, getCoaches, getMembershipPlans } from "@/lib/public-data";
import { getStudentDashboard } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function StudentEnrollmentPage() {
  const user = await currentUser();
  const [catalog, data] = await Promise.all([
    Promise.all([getSports(), getCoaches(), getMembershipPlans()]),
    getStudentDashboard(user.id),
  ]);
  const [sports, coaches, plans] = catalog;

  if (data.currentEnrollment) {
    return (
      <>
        <PageIntro
          eyebrow="Your programme"
          title="You’re already enrolled."
          description="Your active membership is ready. Keep an eye on your training sessions and progress."
        />
        <div className="surface-card p-6 sm:p-8">
          <p className="text-base font-bold text-navy">
            {data.currentEnrollment.sport?.name} · {data.currentEnrollment.membershipPlan?.name}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Coach {data.currentEnrollment.coach?.name || "to be assigned"} · active until{" "}
            {new Date(data.currentEnrollment.endDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/dashboard/student/attendance" variant="secondary">
              View attendance
            </Button>
            <Button href="/dashboard/student/progress">
              Check progress reviews
            </Button>
            <Button href="/dashboard/student" variant="outline">
              Back to dashboard
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <StudentOnboardingFlow
      user={user}
      sports={sports}
      coaches={coaches}
      plans={plans}
    />
  );
}
