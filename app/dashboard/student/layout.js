import DashboardShell from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/server-auth";

export default async function StudentLayout({ children }) {
  const user = await requireRole(["student"]);

  const nav = [
    { label: "Overview", href: "/dashboard/student", icon: "overview" },
    { label: "Coaches", href: "/dashboard/student/coaches", icon: "coaches" },
    { label: "Attendance", href: "/dashboard/student/attendance", icon: "attendance" },
    { label: "Progress", href: "/dashboard/student/progress", icon: "progress" },
    { label: "Payments", href: "/dashboard/student/payments", icon: "payments" },
    { label: "Sports", href: "/dashboard/student/sports", icon: "sports" },
    { label: "Membership", href: "/dashboard/student/membership", icon: "membership" },
    { label: "Profile", href: "/dashboard/student/profile", icon: "profile" },
  ];

  return (
    <DashboardShell user={user} role="student" nav={nav}>
      {children}
    </DashboardShell>
  );
}
