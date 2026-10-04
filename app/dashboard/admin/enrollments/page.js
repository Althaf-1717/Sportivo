import AdminRecordsTable from "@/components/admin/AdminRecordsTable";
import { getAdminRecords } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export default async function AdminEnrollmentsPage() { const rows = await getAdminRecords("enrollments"); return <AdminRecordsTable kind="enrollments" rows={rows} title="Enrolments" description="Review active and past sport programmes across the academy." />; }
