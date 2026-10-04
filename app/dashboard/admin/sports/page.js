import AdminResourceView from "@/components/admin/AdminResourceView";
import { getAdminRecords } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export default async function AdminSportsPage() { const sports = await getAdminRecords("sports"); return <AdminResourceView resource="sports" initialRows={sports} title="Sports" description="Manage the programmes athletes can explore and join." />; }
