import PageIntro from "@/components/dashboard/PageIntro";
import SportCard from "@/components/sports/SportCard";
import { getSports } from "@/lib/public-data";

export const revalidate = 300;
export default async function StudentSportsPage() { const sports = await getSports(); return <div><PageIntro eyebrow="Explore something new" title="Sports at Sportivo" description="Browse the programmes and find a game that makes you want to come back." /><div className="grid gap-4 md:grid-cols-3">{sports.map((sport, index) => <SportCard key={sport.slug || sport._id} sport={sport} index={index} />)}</div></div>; }
