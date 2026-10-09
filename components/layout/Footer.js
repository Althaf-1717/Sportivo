import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200/60 bg-[#070b14] text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-blue/15 blur-[120px]" />

      <div className="container-wide relative z-10 grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              src="/images/sportivo-logo.png"
              alt="Sportivo Logo"
              className="h-10 w-10 rounded-xl object-cover bg-white p-0.5 shadow-md ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105"
            />
            <span>
              <b className="block text-[15px] font-black tracking-wide text-white">
                SPORT<span className="text-orange">IVO</span>
              </b>
              <small className="text-[8px] font-bold tracking-[.25em] text-white/50">
                SPORTS ACADEMY
              </small>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-400">
            Elite coaching, structured developmental pathways, and verified training progression for athletes of all levels.
          </p>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[.18em] text-white/80">Explore</h2>
          <div className="mt-4 grid gap-2.5 text-xs text-slate-400">
            <Link href="/sports" className="transition hover:text-white hover:translate-x-0.5 inline-block">
              Sports Programs
            </Link>
            <Link href="/coaches" className="transition hover:text-white hover:translate-x-0.5 inline-block">
              Academy Coaches
            </Link>
            <Link href="/membership" className="transition hover:text-white hover:translate-x-0.5 inline-block">
              Membership Tiers
            </Link>
            <Link href="/about" className="transition hover:text-white hover:translate-x-0.5 inline-block">
              Our Story & Methodology
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[.18em] text-white/80">Your Academy</h2>
          <div className="mt-4 grid gap-2.5 text-xs text-slate-400">
            <Link href="/register" className="transition hover:text-white hover:translate-x-0.5 inline-block">
              Athlete Registration
            </Link>
            <Link href="/login" className="transition hover:text-white hover:translate-x-0.5 inline-block">
              Member Sign In
            </Link>
            <Link href="/contact" className="transition hover:text-white hover:translate-x-0.5 inline-block">
              Contact Academy
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <p className="text-xs font-bold text-white">Ready for your next session?</p>
          <p className="mt-2 text-[11px] leading-5 text-slate-400">
            Explore sports programs, meet verified coaches, and start your trial today.
          </p>
          <Link
            href="/sports"
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-orange transition hover:text-orange/80 hover:translate-x-1"
          >
            Explore sports <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="container-wide flex flex-col gap-2 py-5 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sportivo Sports Academy India. Train well. Play well.</p>
          <p className="text-[10px] tracking-wide text-slate-500">Built for the love of the game.</p>
        </div>
      </div>
    </footer>
  );
}
