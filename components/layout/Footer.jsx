import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return <footer className="bg-navy text-white"><div className="container-wide grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-16">
    <div><Link href="/" className="flex items-center gap-2.5"><img src="/images/sportivo-logo.png" alt="Sportivo Logo" className="h-10 w-10 rounded-xl object-cover bg-white p-0.5" /><span><b className="block text-[14px] font-black tracking-wide text-white">SPORT<span className="text-orange">IVO</span></b><small className="text-[8px] font-bold tracking-[.22em] text-white/55">SPORTS ACADEMY</small></span></Link><p className="mt-4 max-w-xs text-xs leading-6 text-white/55">Good coaching. Thoughtful progress. A place to love the game and keep getting better.</p></div>
    <div><h2 className="text-[11px] font-bold uppercase tracking-[.12em] text-white/80">Explore</h2><div className="mt-4 grid gap-3 text-xs text-white/60"><Link href="/sports">Sports</Link><Link href="/coaches">Meet the coaches</Link><Link href="/membership">Membership</Link><Link href="/about">Our story</Link></div></div>
    <div><h2 className="text-[11px] font-bold uppercase tracking-[.12em] text-white/80">Your academy</h2><div className="mt-4 grid gap-3 text-xs text-white/60"><Link href="/register">Join Sportivo</Link><Link href="/login">Member sign in</Link><Link href="/contact">Contact us</Link></div></div>
    <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><p className="text-xs font-semibold">Ready for your next session?</p><p className="mt-2 text-[11px] leading-5 text-white/55">Pick a sport, meet your coach, and make a plan.</p><Link href="/sports" className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-orange">Explore sports <ArrowUpRight size={13} /></Link></div>
  </div><div className="border-t border-white/10"><div className="container-wide flex flex-col gap-2 py-4 text-[10px] text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Sportivo Academy. Train well. Play well.</p><p>Built for the love of the game.</p></div></div></footer>;
}
