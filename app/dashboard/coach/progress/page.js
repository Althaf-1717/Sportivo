import PageIntro from "@/components/dashboard/PageIntro";
import ProgressWorkspace from "@/components/coach/ProgressWorkspace";
import { currentUser } from "@/lib/server-auth";
import { getCoachEnrollments } from "@/lib/dashboard-data";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";

export const dynamic = "force-dynamic";
export default async function CoachProgressPage() {
  const user = await currentUser();
  const enrollments = await getCoachEnrollments(user.id);
  let progress = [];
  if (process.env.MONGODB_URI) { await connectDB(); progress = await Progress.find({ coach: user.id }).sort({ createdAt: -1 }).limit(50).populate("student", "name").populate("sport", "name").lean(); progress = JSON.parse(JSON.stringify(progress)); }
  return <div><PageIntro eyebrow="Good feedback moves people forward" title="Student progress" description="Add skill reviews with clear scores, kind feedback, and a useful next focus." /><ProgressWorkspace enrollments={enrollments} initialProgress={progress} /></div>;
}
