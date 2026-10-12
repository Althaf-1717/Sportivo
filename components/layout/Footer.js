import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-stone-200/70 bg-white/60 backdrop-blur-sm">
      {/* Ambient Warm Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_65%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/images/sportivo-logo.png"
                alt="Sportivo Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Sport<span className="text-orange-600">ivo</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">
              Train without the chaos. The all-in-one athletic academy & digital progress operating system built for cricket, football, and basketball athletes in Bengaluru.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              2026 Season · All Grounds Active
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-900">
              Programmes
            </h2>
            <div className="mt-4 grid gap-2.5 text-sm text-stone-500">
              <Link href="/sports/cricket" className="transition hover:text-orange-600">
                Cricket Academy
              </Link>
              <Link href="/sports/football" className="transition hover:text-orange-600">
                Football Academy
              </Link>
              <Link href="/sports/basketball" className="transition hover:text-orange-600">
                Basketball Academy
              </Link>
              <Link href="/sports" className="transition hover:text-orange-600">
                All Sports
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-900">
              Academy
            </h2>
            <div className="mt-4 grid gap-2.5 text-sm text-stone-500">
              <Link href="/coaches" className="transition hover:text-orange-600">
                Pro Coaches
              </Link>
              <Link href="/membership" className="transition hover:text-orange-600">
                Membership Plans
              </Link>
              <Link href="/about" className="transition hover:text-orange-600">
                Our Story
              </Link>
              <Link href="/contact" className="transition hover:text-orange-600">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-900">
              Portals
            </h2>
            <div className="mt-4 grid gap-2.5 text-sm text-stone-500">
              <Link href="/login?portal=student" className="transition hover:text-orange-600">
                Athlete Login
              </Link>
              <Link href="/login?portal=coach" className="transition hover:text-orange-600">
                Coach Login
              </Link>
              <Link href="/login?portal=admin" className="transition hover:text-orange-600">
                Admin Portal
              </Link>
              <Link href="/register" className="transition hover:text-orange-600">
                Create Account
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-900">
              Start Today
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-stone-500">
              Book your first session and get paired with a specialist coach.
            </p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 transition hover:text-orange-700 hover:translate-x-0.5"
            >
              Join Sportivo <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-stone-200/70 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sportivo Athletic Academy Bengaluru. All rights reserved.</p>
          <p className="font-medium text-stone-400">
            Train with purpose · Play with belief
          </p>
        </div>
      </div>
    </footer>
  );
}
