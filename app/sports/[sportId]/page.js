import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3, Users, ShieldCheck } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  getSportBySlug,
  getSports,
  getCoaches,
  getMembershipPlans,
} from "@/lib/public-data";
import CoachCard from "@/components/coaches/CoachCard";
import MembershipCard from "@/components/membership/MembershipCard";

function getMatchedSportImage(sport) {
  const key = `${sport?.slug || ""} ${sport?.name || ""}`.toLowerCase();
  if (key.includes("cricket")) return "/images/sport-cricket.jpg";
  if (key.includes("football") || key.includes("soccer"))
    return "/images/sport-football.jpg";
  if (key.includes("basketball")) return "/images/sport-basketball.jpg";
  return "/images/sport-cricket.jpg";
}

export async function generateStaticParams() {
  const sports = await getSports();
  return sports.map((sport) => ({ sportId: sport.slug }));
}

export async function generateMetadata({ params }) {
  const { sportId } = await params;
  const sport = await getSportBySlug(sportId);
  return {
    title: sport ? `${sport.name} coaching` : "Sport not found",
    description: sport?.description || "Explore academy coaching.",
  };
}

export default async function SportDetailsPage({ params }) {
  const { sportId } = await params;
  const [sport, coaches, plans] = await Promise.all([
    getSportBySlug(sportId),
    getCoaches(),
    getMembershipPlans(),
  ]);
  if (!sport) notFound();
  const sportCoaches = coaches.filter(
    (coach) =>
      coach.sport === sport.name ||
      coach.specialization?.toLowerCase().includes(sport.name.toLowerCase())
  );
  const sportPlans = plans.filter(
    (plan) =>
      !plan.sport ||
      plan.sport.name === sport.name ||
      plan.sport === sport.name
  );
  const sportImage = getMatchedSportImage(sport);

  return (
    <PublicLayout>
      <main>
        <section className="py-12 sm:py-16">
          <div className="container-wide grid items-center gap-10 md:grid-cols-[1fr_1.08fr]">
            <div>
              <Badge>{sport.name} programme</Badge>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                A better feel for
                <br />
                <span className="text-gradient-brand italic">the game.</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-stone-600">
                {sport.detail || sport.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={`/register?sport=${sport.slug}`}>
                  Start your journey <ArrowRight size={14} />
                </Button>
                <Button href="/coaches" variant="secondary">
                  Meet the coaches
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap gap-5 text-xs font-semibold text-stone-600">
                <span className="inline-flex items-center gap-1.5">
                  <Users size={15} className="text-orange-600" /> Strict 1 : 6
                  small-group coaching
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={15} className="text-orange-600" /> Morning &amp;
                  evening batches
                </span>
              </div>
            </div>

            {/* Golden-Hour Matched Sport Photography Card */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-stone-200/90 bg-stone-900 shadow-[0_28px_70px_-18px_rgba(234,88,12,0.28)]">
              <Image
                src={sportImage}
                alt={`${sport.name} at Sportivo`}
                fill
                priority
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#19110d]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-white backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-orange-400" />
                  <div>
                    <p className="text-xs font-bold">
                      Sportivo {sport.name} Wing
                    </p>
                    <p className="text-[11px] text-orange-200/80">
                      1 : 6 Specialist Coaching · Live Skill Tracking
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  96% Attendance
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="container-wide grid gap-10 py-12 md:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="eyebrow">What you’ll work on</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
              Fundamentals first.
              <br />
              Game ready next.
            </h2>
            <p className="mt-3 text-xs leading-6 text-stone-600">
              A programme that balances technical skills, athletic development,
              and the confidence to use what you learn.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {(
              sport.focus || [
                "Technical foundations",
                "Game awareness",
                "Movement and fitness",
              ]
            ).map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 text-xs font-bold text-gray-900 shadow-2xs"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl border border-orange-200/70 bg-orange-50 text-orange-600">
                  <Check size={15} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="py-12">
          <div className="container-wide">
            <p className="eyebrow">The right support matters</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
              Meet the {sport.name.toLowerCase()} coaches.
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sportCoaches.slice(0, 3).map((coach, i) => (
                <CoachCard
                  key={coach.slug || coach._id}
                  coach={coach}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="container-wide py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Build your routine</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                Memberships made for progress.
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {sportPlans.slice(0, 3).map((plan, i) => (
              <MembershipCard
                key={plan.slug || plan._id}
                plan={plan}
                featured={i === 1}
                index={i}
              />
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
