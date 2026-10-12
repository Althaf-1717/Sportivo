import PageIntro from "@/components/dashboard/PageIntro";
import ProgressWorkspace from "@/components/coach/ProgressWorkspace";
import { currentUser } from "@/lib/server-auth";
import { getCoachEnrollments } from "@/lib/dashboard-data";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";

export const dynamic = "force-dynamic";

async function getRecentCoachProgress(coachId) {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  const rows = await Progress.find({ coach: coachId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("student", "name")
    .populate("sport", "name")
    .lean();
  return JSON.parse(JSON.stringify(rows));
}

export default async function CoachProgressPage() {
  const user = await currentUser();
  const [enrollments, progress] = await Promise.all([
    getCoachEnrollments(user.id),
    getRecentCoachProgress(user.id),
  ]);
  return (
    <div>
      <PageIntro
        eyebrow="Good feedback moves people forward"
        title="Student progress"
        description="Add skill reviews with clear scores, kind feedback, and a useful next focus."
      />
      <ProgressWorkspace
        enrollments={enrollments}
        initialProgress={progress}
      />
    </div>
  );
}
