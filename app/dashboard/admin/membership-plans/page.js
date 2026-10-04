import AdminResourceView from "@/components/admin/AdminResourceView";
import { getAdminRecords } from "@/lib/dashboard-data";
import { getSports } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export default async function AdminMembershipPage() { const [plans, sports] = await Promise.all([getAdminRecords("membership"), getSports()]); return <AdminResourceView resource="membership" initialRows={plans} sports={sports} title="Membership plans" description="Set clear pricing and programme benefits for each sport." />; }
