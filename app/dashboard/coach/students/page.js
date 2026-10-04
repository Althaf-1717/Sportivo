import PageIntro from "@/components/dashboard/PageIntro";
import CoachStudentsTable from "@/components/coach/CoachStudentsTable";
import { currentUser } from "@/lib/server-auth";
import { getCoachEnrollments } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export default async function CoachStudentsPage() { const user = await currentUser(); const rows = await getCoachEnrollments(user.id); return <div><PageIntro eyebrow="Your coaching group" title="My students" description="Get a quick picture of each athlete’s attendance, current skill level, and membership." /><CoachStudentsTable initialEnrollments={rows} /></div>; }
