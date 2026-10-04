import DashboardShell from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/server-auth";

const nav = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "overview" },
  { label: "Students", href: "/dashboard/admin/students", icon: "students" },
  { label: "Coaches", href: "/dashboard/admin/coaches", icon: "coaches" },
  { label: "Sports", href: "/dashboard/admin/sports", icon: "sports" },
  { label: "Membership Plans", href: "/dashboard/admin/membership-plans", icon: "membership-plans" },
  { label: "Enrollments", href: "/dashboard/admin/enrollments", icon: "enrollments" },
  { label: "Attendance", href: "/dashboard/admin/attendance", icon: "attendance" },
  { label: "Progress", href: "/dashboard/admin/progress", icon: "progress" },
  { label: "Payments", href: "/dashboard/admin/payments", icon: "payments" },
  { label: "Users", href: "/dashboard/admin/users", icon: "users" },
  { label: "Settings", href: "/dashboard/admin/settings", icon: "settings" },
];

export default async function AdminLayout({ children }) {
  const user = await requireRole(["admin"]);
  return <DashboardShell user={user} role="admin" nav={nav}>{children}</DashboardShell>;
}
