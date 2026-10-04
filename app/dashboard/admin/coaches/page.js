import AdminResourceView from "@/components/admin/AdminResourceView";
import { getAdminRecords } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function AdminCoachesPage() {
  const [coaches, sports] = await Promise.all([
    getAdminRecords("coaches"),
    getAdminRecords("sports"),
  ]);

  return (
    <AdminResourceView
      resource="coaches"
      initialRows={coaches}
      sports={sports}
      title="Coaches Management"
      description="Grant and manage coach access, set temporary passwords, assign sports, and oversee active coaching staff."
    />
  );
}
