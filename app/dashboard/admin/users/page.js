import { getAdminRecords } from "@/lib/dashboard-data";
import AdminUserDirectory from "@/components/admin/AdminUserDirectory";

export const dynamic = "force-dynamic";
export default async function AdminUsersPage() { const users = await getAdminRecords("users"); return <AdminUserDirectory initialUsers={users} />; }
