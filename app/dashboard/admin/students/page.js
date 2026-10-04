import StudentDirectory from "@/components/admin/StudentDirectory";
import { getAdminRecords } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export default async function AdminStudentsPage() { const students = await getAdminRecords("students"); return <StudentDirectory initialStudents={students} />; }
