import AdminRecordsTable from "@/components/admin/AdminRecordsTable";
import { getAdminRecords } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export default async function AdminAttendancePage() { const rows = await getAdminRecords("attendance"); return <AdminRecordsTable kind="attendance" rows={rows} title="Attendance records" description="Audit session attendance and coach updates across Sportivo." />; }
