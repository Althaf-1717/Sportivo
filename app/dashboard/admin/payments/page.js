import AdminRecordsTable from "@/components/admin/AdminRecordsTable";
import { getAdminRecords } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export default async function AdminPaymentsPage() { const rows = await getAdminRecords("payments"); return <AdminRecordsTable kind="payments" rows={rows} title="Payments" description="Only server-verified payments count toward academy revenue and active memberships." />; }
