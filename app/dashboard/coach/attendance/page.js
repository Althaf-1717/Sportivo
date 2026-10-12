import PageIntro from "@/components/dashboard/PageIntro";
import AttendanceWorkspace from "@/components/coach/AttendanceWorkspace";
import { currentUser } from "@/lib/server-auth";
import { getCoachEnrollments } from "@/lib/dashboard-data";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export const dynamic = "force-dynamic";

async function getRecentCoachAttendance(coachId) {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  const rows = await Attendance.find({ coach: coachId })
    .sort({ date: -1 })
    .limit(80)
    .populate("student", "name")
    .populate("sport", "name")
    .lean();
  return JSON.parse(JSON.stringify(rows));
}

export default async function CoachAttendancePage() {
  const user = await currentUser();
  const [enrollments, attendance] = await Promise.all([
    getCoachEnrollments(user.id),
    getRecentCoachAttendance(user.id),
  ]);
  return (
    <div>
      <PageIntro
        eyebrow="A record of the work"
        title="Take attendance"
        description="Mark present or absent for an enrolled athlete. One record per student and date keeps the history consistent."
      />
      <AttendanceWorkspace
        enrollments={enrollments}
        initialAttendance={attendance}
      />
    </div>
  );
}
