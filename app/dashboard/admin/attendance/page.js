import AdminRecordsTable from "@/components/admin/AdminRecordsTable";
import AttendanceWorkspace from "@/components/coach/AttendanceWorkspace";
import { getAdminRecords } from "@/lib/dashboard-data";
import { connectDB } from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";
import PageIntro from "@/components/dashboard/PageIntro";
export const dynamic = "force-dynamic";
export default async function AdminAttendancePage() {
  let activeEnrollments = [];
  let recentAttendance = [];
  let rows = [];
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const [enrollmentDocs, attendanceDocs, recordRows] = await Promise.all([Enrollment.find({
        status: "active"
      }).sort({
        createdAt: -1
      }).limit(100).populate("student", "name email studentId").populate("sport", "name").populate("coach", "name").lean(), Attendance.find({}).sort({
        date: -1,
        createdAt: -1
      }).limit(50).populate("student", "name email studentId").populate("sport", "name").lean(), getAdminRecords("attendance")]);
      activeEnrollments = enrollmentDocs || [];
      recentAttendance = attendanceDocs || [];
      rows = recordRows || [];
    } catch {
      rows = await getAdminRecords("attendance");
    }
  } else {
    rows = await getAdminRecords("attendance");
  }
  return <div className="space-y-6">
      <PageIntro eyebrow="Academy attendance" title="Session Attendance & Audit" description="Mark and audit session attendance across all enrolled athletes and training squads." />

      <AttendanceWorkspace title="Admin Attendance for student" description="Mark attendance for enrolled athletes across all sports and coaching squads." enrollments={JSON.parse(JSON.stringify(activeEnrollments))} initialAttendance={JSON.parse(JSON.stringify(recentAttendance))} />

      <AdminRecordsTable kind="attendance" rows={rows} title="Attendance records" description="Audit session attendance and coach updates across Sportivo." />
    </div>;
}
