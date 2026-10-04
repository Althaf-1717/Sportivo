import PageIntro from "@/components/dashboard/PageIntro";
import CoachCard from "@/components/coaches/CoachCard";
import { getCoaches } from "@/lib/public-data";

export const revalidate = 300;
export default async function StudentCoachesPage() { const coaches = await getCoaches(); return <div><PageIntro eyebrow="People to help you grow" title="Meet your coaches" description="Find the specialist who can help you enjoy the game and develop at your pace." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{coaches.map((coach, index) => <CoachCard key={coach.slug || coach._id} coach={coach} index={index} />)}</div></div>; }
