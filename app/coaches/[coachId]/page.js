import { notFound } from "next/navigation";
import { ArrowRight, Award, BadgeCheck, CalendarDays } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { getCoachBySlug, getCoaches } from "@/lib/public-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export async function generateStaticParams() {
  const coaches = await getCoaches();
  return coaches.map((coach) => ({ coachId: coach.slug }));
}

export async function generateMetadata({ params }) {
  const { coachId } = await params;
  const coach = await getCoachBySlug(coachId);
  const name = coach?.user?.name || coach?.name;
  return { title: name ? `${name}, academy coach` : "Coach not found", description: coach?.bio || "Meet a Sportivo Academy coach." };
}

export default async function CoachDetailsPage({ params }) {
  const { coachId } = await params;
  const coach = await getCoachBySlug(coachId);
  if (!coach) notFound();
  const name = coach.user?.name || coach.name || "Academy Coach";
  const coachImage = coach.image || coach.user?.image;
  return (
    <PublicLayout>
      <main className="min-h-[70vh] bg-paper py-12 sm:py-16">
        <div className="container-wide max-w-4xl">
          <div className="surface-card overflow-hidden">
            <div className="grid md:grid-cols-[.72fr_1.28fr]">
              <div className="grid min-h-[250px] place-items-center bg-navy p-8 text-white">
                <div className="text-center">
                  {coachImage ? (
                    <img
                      src={coachImage}
                      alt={name}
                      className="mx-auto h-28 w-28 rounded-[28px] object-cover border-2 border-white/20 shadow-lg"
                    />
                  ) : (
                    <div className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-white/10 text-2xl font-bold text-orange">
                      {coach.initials || name.split(" ").map((word) => word[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <Badge tone="orange" className="mt-5">
                    <BadgeCheck size={12} className="mr-1" /> Sportivo coach
                  </Badge>
                </div>
              </div>
              <div className="p-7 sm:p-9">
                <p className="eyebrow">Meet your coach</p>
                <h1 className="mt-2 text-3xl font-bold tracking-[-.05em] text-navy">{name}</h1>
                <p className="mt-2 text-sm font-semibold text-blue">{coach.role || coach.specialization}</p>
                <p className="mt-5 text-sm leading-7 text-slate-600">{coach.bio}</p>
                <div className="mt-6 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Award size={15} className="text-orange" />
                    {coach.experience || "Experienced"} coaching experience
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-orange" />
                    Small-group sessions
                  </p>
                </div>
                <Button href="/login" className="mt-7">
                  Train with {name.split(" ")[0]} <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
