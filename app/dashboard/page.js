import { redirect } from "next/navigation";
import { requireRole } from "@/lib/server-auth";

export default async function DashboardIndex() {
  const user = await requireRole(["student", "coach", "admin"]);
  redirect(`/dashboard/${user.role}`);
}
