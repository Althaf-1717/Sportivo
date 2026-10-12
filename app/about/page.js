import Image from "next/image";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowRight, Heart, Target, UsersRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Our story",
  description: "Learn what Sportivo Academy believes about coaching and sport.",
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <main>
        <section className="py-12 sm:py-16">
          <div className="container-wide grid items-center gap-10 md:grid-cols-[.95fr_1.05fr]">
            <div>
              <p className="eyebrow">Why we’re here</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                Sport should make you feel more like{" "}
                <span className="text-gradient-brand italic">yourself</span>.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
                Sportivo is built around a simple idea: coaching is at its best
                when it helps athletes enjoy the game, build disciplined habits,
                and see verified progress every week.
              </p>
              <Button href="/sports" className="mt-7">
                Find your sport <ArrowRight size={14} />
              </Button>
            </div>

            {/* Golden-Hour Sports Collage Showcase */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl border border-stone-200/90 bg-stone-900 shadow-lg">
                <Image
                  src="/images/sport-cricket.jpg"
                  alt="Cricket training at Sportivo Academy"
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#19110d]/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/25 bg-black/45 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                  <ShieldCheck size={14} className="text-orange-400" />
                  <span>1 : 6 Specialist Coaching Cohorts</span>
                </div>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-900 shadow-md">
                <Image
                  src="/images/sport-football.jpg"
                  alt="Football training at Sportivo Academy"
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-900 shadow-md">
                <Image
                  src="/images/sport-basketball.jpg"
                  alt="Basketball training at Sportivo Academy"
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container-wide py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                <Heart key="heart" size={18} />,
                "People before performance",
                "Everyone deserves to be seen, supported, and challenged at the right level.",
              ],
              [
                <Target key="target" size={18} />,
                "Progress over pressure",
                "We value steady improvement and the habits behind it, not just the final score.",
              ],
              [
                <UsersRound key="team" size={18} />,
                "Better together",
                "A positive team culture makes training a place you want to come back to.",
              ],
            ].map(([icon, title, copy]) => (
              <article key={title} className="surface-card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-orange-200/80 bg-orange-50 text-orange-600">
                  {icon}
                </span>
                <h2 className="mt-4 text-base font-bold text-gray-900">
                  {title}
                </h2>
                <p className="mt-2 text-xs leading-6 text-stone-600">{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
