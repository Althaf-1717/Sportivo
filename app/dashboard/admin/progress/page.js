import AdminRecordsTable from "@/components/admin/AdminRecordsTable";
import { getAdminRecords } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export default async function AdminProgressPage() { const rows = await getAdminRecords("progress"); return <AdminRecordsTable kind="progress" rows={rows} title="Progress reviews" description="Review skill levels, fitness, technical scores, and coach notes." />; }
