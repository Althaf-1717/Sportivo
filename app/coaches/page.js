import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import CoachCard from "@/components/coaches/CoachCard";
import { Button } from "@/components/ui/Button";
import { getCoaches } from "@/lib/public-data";

export const revalidate = 300;

export const metadata = {
  title: "Academy Coaches · Sportivo Sports Academy",
  description: "Meet our certified academy coaches specializing in cricket, football, and basketball development.",
};

export default async function CoachesPage() {
  const coaches = await getCoaches();

  return (
    <PublicLayout>
      <main className="min-h-screen py-12 sm:py-16">
        <div className="container-wide">
          {/* Header Section */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue-soft/80 px-3.5 py-1.5 text-[11px] font-bold text-blue backdrop-blur-md shadow-xs">
              <Sparkles size={12} className="text-orange" />
              <span>SPORTIVO COACHING STAFF</span>
            </div>
            <h1 className="mt-4 text-[32px] sm:text-[44px] font-black tracking-tight text-navy leading-[1.1]">
              Coaches Who Elevate Every Athlete
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Our certified mentors combine elite competitive experience with a player-first developmental philosophy. Small cohorts, individualized feedback, and measurable progression.
            </p>
          </div>

          {/* Coaching Standards Highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange/10 text-orange">
                <Users size={18} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-navy">1 : 6 Coach-to-Athlete Ratio</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Guaranteed personal attention and detailed technical correction in every drill.
              </p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-soft text-blue">
                <Award size={18} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-navy">Certified Specialists</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Accredited trainers with competitive domestic and national playing backgrounds.
              </p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={18} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-navy">Digital Skill Tracking</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Regular fitness, technical, and match reviews logged directly into your portal.
              </p>
            </div>
          </div>

          {/* Coaches Grid */}
          <div className="mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <p className="eyebrow">Meet the team</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-navy">
                  Head Coaches & Mentors
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Showing {coaches.length} academy coaches across Cricket, Football & Basketball
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coaches.map((coach, index) => (
                <CoachCard key={coach.slug || coach._id || index} coach={coach} index={index} />
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 overflow-hidden rounded-3xl bg-[#070b14] p-8 sm:p-12 text-white relative shadow-2xl border border-white/10">
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue/20 blur-[100px]" />
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-[10px] font-bold text-orange">
                <ShieldCheck size={12} /> VERIFIED ACADEMY PATHWAY
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Ready to train under professional coaching?
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                Select your preferred sport, choose your membership duration, and begin your guided development journey today.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/register" className="!px-6 !py-3 !text-xs shadow-md">
                  Join Sportivo Academy <ArrowRight size={14} />
                </Button>
                <Button href="/sports" variant="secondary" className="!px-6 !py-3 !text-xs !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  Explore Sports Disciplines
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
