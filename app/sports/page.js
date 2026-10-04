import PublicLayout from "@/components/layout/PublicLayout";
import SportCard from "@/components/sports/SportCard";
import { getSports } from "@/lib/public-data";

export const metadata = { title: "Sports", description: "Explore cricket, football, and basketball coaching at Sportivo Academy." };
export const revalidate = 300;

export default async function SportsPage() {
  const sports = await getSports();
  return <PublicLayout><main className="min-h-[65vh] bg-paper"><div className="container-wide py-12 sm:py-16"><p className="eyebrow">Find what moves you</p><h1 className="mt-2 text-4xl font-bold tracking-[-.06em] text-navy">Choose your sport.</h1><p className="section-copy mt-3 max-w-2xl">Explore our programmes, meet your coach, and find a training rhythm that works for you.</p><div className="mt-9 grid gap-5 md:grid-cols-3">{sports.map((sport, i) => <SportCard key={sport.slug || sport._id} sport={sport} index={i} />)}</div></div></main></PublicLayout>;
}
