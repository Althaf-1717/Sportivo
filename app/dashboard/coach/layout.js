import DashboardShell from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/server-auth";

const nav = [
  { label: "Overview", href: "/dashboard/coach", icon: "overview" },
  { label: "My Students", href: "/dashboard/coach/students", icon: "students" },
  { label: "Attendance", href: "/dashboard/coach/attendance", icon: "attendance" },
  { label: "Student Progress", href: "/dashboard/coach/progress", icon: "student-progress" },
  { label: "Profile", href: "/dashboard/coach/profile", icon: "profile" },
];

export default async function CoachLayout({ children }) {
  const user = await requireRole(["coach"]);
  return <DashboardShell user={user} role="coach" nav={nav}>{children}</DashboardShell>;
}
