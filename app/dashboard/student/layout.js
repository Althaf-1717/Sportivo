import DashboardShell from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/server-auth";
import { connectDB } from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";

export default async function StudentLayout({ children }) {
  const user = await requireRole(["student"]);

  let isEnrolled = false;
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const active = await Enrollment.findOne({ student: user.id, status: "active" }).select("_id").lean();
      isEnrolled = Boolean(active);
    } catch {
      // fallback
    }
  }

  const nav = isEnrolled
    ? [
        { label: "Overview", href: "/dashboard/student", icon: "overview" },
        { label: "Coaches", href: "/dashboard/student/coaches", icon: "coaches" },
        { label: "Attendance", href: "/dashboard/student/attendance", icon: "attendance" },
        { label: "Progress", href: "/dashboard/student/progress", icon: "progress" },
        { label: "Payments", href: "/dashboard/student/payments", icon: "payments" },
        { label: "Profile", href: "/dashboard/student/profile", icon: "profile" },
      ]
    : [
        { label: "Membership Planning", href: "/dashboard/student", icon: "membership" },
        { label: "Sports", href: "/dashboard/student/sports", icon: "sports" },
      ];

  return <DashboardShell user={user} role="student" nav={nav}>{children}</DashboardShell>;
}
