import DashboardShell from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/server-auth";
import { connectDB } from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { getFallbackEnrollment } from "@/lib/fallback-users";
import { getStudentStateFromCookie } from "@/lib/student-state-cookie";
export default async function StudentLayout({
  children
}) {
  const user = await requireRole(["student"]);
  const cookieState = await getStudentStateFromCookie(user.email);
  let isEnrolled = Boolean(cookieState?.enrollment || getFallbackEnrollment(user.id));
  if (!isEnrolled && process.env.MONGODB_URI && /^[a-f\d]{24}$/i.test(String(user.id))) {
    try {
      await connectDB();
      const active = await Enrollment.findOne({
        student: user.id,
        status: "active"
      }).select("_id").lean();
      if (active) isEnrolled = true;
    } catch {}
  }
  const nav = isEnrolled ? [{
    label: "Overview",
    href: "/dashboard/student",
    icon: "overview"
  }, {
    label: "Coaches",
    href: "/dashboard/student/coaches",
    icon: "coaches"
  }, {
    label: "Attendance",
    href: "/dashboard/student/attendance",
    icon: "attendance"
  }, {
    label: "Progress",
    href: "/dashboard/student/progress",
    icon: "progress"
  }, {
    label: "Payments",
    href: "/dashboard/student/payments",
    icon: "payments"
  }, {
    label: "Sports",
    href: "/dashboard/student/sports",
    icon: "sports"
  }, {
    label: "Membership",
    href: "/dashboard/student/membership",
    icon: "membership"
  }, {
    label: "Profile",
    href: "/dashboard/student/profile",
    icon: "profile"
  }] : [{
    label: "Membership Planning",
    href: "/dashboard/student",
    icon: "membership"
  }, {
    label: "Sports",
    href: "/dashboard/student/sports",
    icon: "sports"
  }];
  return <DashboardShell user={user} role="student" nav={nav}>
      {children}
    </DashboardShell>;
}
