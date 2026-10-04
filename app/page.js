import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, CirclePlay, Clock3, ShieldCheck, Sparkles, Users, Trophy, Activity } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import SportCard from "@/components/sports/SportCard";
import CoachCard from "@/components/coaches/CoachCard";
import MembershipCard from "@/components/membership/MembershipCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getSports, getCoaches, getMembershipPlans } from "@/lib/public-data";

export const revalidate = 300;

export default async function HomePage() {
  const [sports, coaches, plans] = await Promise.all([getSports(), getCoaches(), getMembershipPlans()]);
  const featuredCoaches = coaches.slice(0, 3);
  const featuredPlans = plans.filter((plan, index, list) => list.findIndex((candidate) => candidate.name === plan.name) === index).slice(0, 3);
  return <PublicLayout>
    <main>
      <section className="overflow-hidden bg-paper">
        <div className="container-wide grid items-center gap-10 py-12 md:grid-cols-[.86fr_1.14fr] md:gap-12 md:py-16 lg:py-[76px]">
          <div className="max-w-[500px] pb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue/10 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-orange" /> Coaching that moves with you</div>
            <p className="eyebrow mt-7">A stronger game starts here</p>
            <h1 className="mt-3 text-[42px] font-bold leading-[1.12] tracking-[-.065em] text-navy sm:text-[52px] lg:text-[61px]">Train with purpose.<br /><span className="text-blue">Play with belief.</span></h1>
            <p className="mt-5 max-w-[440px] text-[14px] leading-7 text-slate-600">Find your sport, learn from people who care, and see how every session adds up.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3"><Button href="/sports">Explore sports <ArrowRight size={15} /></Button><Button href="/about" variant="secondary"><CirclePlay size={15} /> Get to know us</Button></div>
            <div className="mt-10 flex items-center gap-4 border-t border-slate-200 pt-6">
              <div className="flex -space-x-2" aria-label="Academy community"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-paper bg-blue-soft text-[9px] font-bold text-blue">AM</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-paper bg-orange/10 text-[9px] font-bold text-orange">KR</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-paper bg-emerald-50 text-[9px] font-bold text-emerald-700">DS</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-paper bg-navy text-[9px] font-bold text-white">+</span></div>
              <div><p className="text-[11px] font-bold text-navy">Better together, every week</p><p className="mt-0.5 text-[10px] text-slate-500">Good coaching makes room to grow.</p></div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[630px] md:ml-auto">
            <div className="relative aspect-[1.08/1] overflow-hidden rounded-[24px] bg-[#c6d4e4] shadow-[0_24px_64px_rgba(11,31,58,.18)] sm:aspect-[1.2/1]">
              <Image src="/images/hero-football.png" alt="A Sportivo football player practicing on the training pitch" fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover object-[59%_center]" />
              <div className="absolute inset-0 bg-navy/10" />
              <div className="absolute left-4 top-4 rounded-xl border border-white/60 bg-white/90 px-3 py-2 backdrop-blur-sm sm:left-5 sm:top-5"><p className="text-[8px] font-bold uppercase tracking-[.15em] text-slate-400">SPORTIVO · EST. 2024</p><p className="mt-1 text-[10px] font-semibold text-navy">Bengaluru, India</p></div>
              <div className="absolute bottom-4 left-4 max-w-[240px] rounded-2xl bg-navy px-4 py-3 text-white sm:bottom-5 sm:left-5"><div className="flex items-center gap-2 text-orange"><Activity size={14} /><span className="text-[9px] font-bold uppercase tracking-[.15em]">One session at a time</span></div><p className="mt-2 text-[12px] font-semibold leading-5">Effort, meet opportunity.</p></div>
              <div className="absolute bottom-5 right-5 hidden items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-lg sm:flex"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-soft text-blue"><Trophy size={15} /></span><span><span className="block text-[9px] text-slate-500">Your progress</span><span className="block text-[11px] font-bold text-navy">Worth showing up for</span></span></div>
            </div>
            <div className="absolute -bottom-5 right-7 hidden h-10 w-10 items-center justify-center rounded-full border-4 border-paper bg-orange text-white shadow-md sm:flex"><ArrowDown size={16} /></div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white"><div className="container-wide grid grid-cols-2 gap-0 divide-x divide-y divide-slate-100 py-1 md:grid-cols-4 md:divide-y-0">
        {[["3", "sports to explore"], ["6+", "specialist coaches"], ["Small", "training groups"], ["Your pace", "progress that’s personal"]].map(([value, label]) => <div key={label} className="px-4 py-5 text-center sm:py-6"><p className="text-lg font-bold tracking-[-.04em] text-navy">{value}</p><p className="mt-1 text-[9px] font-medium text-slate-500 sm:text-[10px]">{label}</p></div>)}
      </div></section>

      <section className="container-wide py-16 sm:py-20" id="sports">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Find your game</p><h2 className="section-title mt-2">Good things start with a sport.</h2><p className="section-copy mt-3 max-w-xl">Different games, one shared belief: the right support makes practice count.</p></div><Link href="/sports" className="inline-flex w-fit items-center gap-2 text-[11px] font-bold text-blue">All sports <ArrowUpRight size={14} /></Link></div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{sports.slice(0, 3).map((sport, i) => <SportCard key={sport.slug || sport._id} sport={sport} index={i} />)}</div>
      </section>

      <section className="bg-paper py-16 sm:py-20"><div className="container-wide grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="eyebrow">The Sportivo way</p><h2 className="section-title mt-2 max-w-md">More than drills.<br />A place to grow.</h2><p className="section-copy mt-4 max-w-md">Great coaching builds the athlete and the person. We keep the work focused, the feedback honest, and the next step clear.</p><Button href="/about" variant="secondary" className="mt-6">Our approach <ArrowRight size={14} /></Button></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[[<ShieldCheck key="care" size={18} />, "Coaching with care", "Small groups mean thoughtful feedback and room for every player."], [<Activity key="progress" size={18} />, "Progress you can follow", "Training notes and skill updates turn effort into a clear journey."], [<Users key="team" size={18} />, "A team around you", "Positive teammates make it easier to keep showing up."], [<Clock3 key="schedule" size={18} />, "Built for real life", "A steady routine fits around school, work, and everything else." ]].map(([icon, title, body]) => <div key={title} className="surface-card p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-soft text-blue">{icon}</span><h3 className="mt-4 text-[13px] font-bold text-navy">{title}</h3><p className="mt-2 text-[11px] leading-6 text-slate-500">{body}</p></div>)}
        </div>
      </div></section>

      <section className="container-wide py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">People who make a difference</p><h2 className="section-title mt-2">Meet your coaching team.</h2><p className="section-copy mt-3 max-w-xl">Skilled, supportive coaches who know the game — and how to help you enjoy it.</p></div><Link href="/coaches" className="inline-flex w-fit items-center gap-2 text-[11px] font-bold text-blue">Meet every coach <ArrowUpRight size={14} /></Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featuredCoaches.map((coach, i) => <CoachCard key={coach.slug || coach._id} coach={coach} index={i} />)}</div>
      </section>

      <section className="bg-[#f8faff] py-16 sm:py-20"><div className="container-wide">
        <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">A good plan for your season</p><h2 className="section-title mt-2">Start simple. Keep getting better.</h2><p className="section-copy mt-3">Choose a membership that gives you the space to build a lasting routine.</p></div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">{featuredPlans.map((plan, i) => <MembershipCard key={plan.slug || plan._id} plan={plan} featured={i === 1} />)}</div>
        <p className="mt-5 text-center text-[10px] text-slate-400">Plans are available for cricket, football, and basketball. Select your sport during enrolment.</p>
      </div></section>

      <section className="container-wide py-16 sm:py-20"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Small steps. Real confidence.</p><h2 className="section-title mt-2">The moments that make practice matter.</h2><p className="section-copy mt-3 max-w-xl">A few sample stories show the kind of progress thoughtful coaching can support.</p></div><span className="pill w-fit">Sample member stories</span></div><div className="mt-8 grid gap-4 md:grid-cols-3">{[
          ["“I used to rush every shot. Now I take a breath, trust my footwork, and enjoy being at the crease.”", "A developing cricketer", "Cricket"],
          ["“The small group made it easier to ask questions. I’m more confident on the ball and in the team.”", "A youth footballer", "Football"],
          ["“I can see what I’ve been working on and what comes next. That keeps me excited to train.”", "A basketball athlete", "Basketball"],
        ].map(([quote, person, sport]) => <figure key={person} className="surface-card flex h-full flex-col p-5"><span aria-hidden="true" className="text-2xl font-bold leading-none text-orange">“</span><blockquote className="mt-3 flex-1 text-[12px] leading-6 text-slate-600">{quote.slice(1, -1)}</blockquote><figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="text-[11px] font-bold text-navy">{person}</span><span className="rounded-full bg-blue-soft px-2.5 py-1 text-[9px] font-semibold text-blue">{sport}</span></figcaption></figure>)}
        </div><p className="mt-3 text-[9px] text-slate-400">Illustrative copy for this project demo; no real member testimonial is implied.</p></section>

      <section className="container-wide py-16 sm:py-20"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-center"><div><p className="eyebrow">How it works</p><h2 className="section-title mt-2">Three steps.<br />A better routine.</h2><p className="section-copy mt-4">Getting started should feel easy. We’ll help with the rest.</p><Button href="/login" className="mt-6">Take your first step <ArrowRight size={14} /></Button></div><div className="grid gap-3 sm:grid-cols-3">
          {[["01", "Choose your sport", "Explore the games and training that feel right for you."], ["02", "Meet your coach", "Find the specialist and membership that fit your goals."], ["03", "Show up & grow", "Track attendance, review progress, and celebrate the work."]].map(([n, title, body], i) => <div key={n} className="relative rounded-2xl border border-slate-200 p-5"><span className={`text-[11px] font-bold ${i === 2 ? "text-orange" : "text-blue"}`}>{n}</span><h3 className="mt-5 text-[13px] font-bold text-navy">{title}</h3><p className="mt-2 text-[11px] leading-6 text-slate-500">{body}</p></div>)}
        </div></div></section>

      <section className="container-wide pb-16 sm:pb-20"><div className="overflow-hidden rounded-[22px] bg-navy px-6 py-9 text-white sm:px-10 sm:py-11"><div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><Badge tone="orange"><Sparkles size={11} className="mr-1" /> Your next chapter</Badge><h2 className="mt-4 text-[25px] font-bold tracking-[-.04em] sm:text-[31px]">The best time to begin is your next session.</h2><p className="mt-2 max-w-xl text-xs leading-6 text-white/60">Join a community that puts thoughtful coaching and steady progress first.</p></div><Button href="/register" className="shrink-0">Join Sportivo <ArrowUpRight size={14} /></Button></div></div></section>
    </main>
  </PublicLayout>;
}
