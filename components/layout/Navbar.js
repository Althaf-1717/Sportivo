"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import InteractivePillButton from "@/components/ui/InteractivePillButton";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Trophy,
  Activity,
  Users,
  ShieldCheck,
  ClipboardCheck,
  Sparkles,
  Grid3X3,
  BookOpen,
} from "lucide-react";

const sportsMenu = [
  {
    title: "Cricket Academy",
    description: "Technical batting, pace & spin bowling in 1:6 cohorts",
    href: "/sports/cricket",
    icon: Trophy,
  },
  {
    title: "Football Academy",
    description: "Tactical positional play, first-touch mastery & match drills",
    href: "/sports/football",
    icon: Activity,
  },
  {
    title: "Basketball Academy",
    description: "Court agility, shooting mechanics & 5v5 game systems",
    href: "/sports/basketball",
    icon: Sparkles,
  },
  {
    title: "All Sports Programmes",
    description: "Compare every Sportivo discipline, schedule & batch",
    href: "/sports",
    icon: Grid3X3,
  },
];

const platformMenu = [
  {
    title: "Athlete Portal",
    description: "Track attendance, skill ratings & membership renewals",
    href: "/login?portal=student",
    icon: Users,
  },
  {
    title: "Coach Workspace",
    description: "Mark session attendance & publish athlete evaluations",
    href: "/login?portal=coach",
    icon: ClipboardCheck,
  },
  {
    title: "Admin Operations",
    description: "Manage cohorts, enrolments, coaches & verified revenue",
    href: "/login?portal=admin",
    icon: ShieldCheck,
  },
  {
    title: "Academy Story & Method",
    description: "How Sportivo builds disciplined, match-ready athletes",
    href: "/about",
    icon: BookOpen,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border pl-4 pr-3 transition-all duration-300 ${
          scrolled
            ? "border-stone-200/90 bg-white/90 shadow-[0_14px_40px_-14px_rgba(28,25,23,0.14)] backdrop-blur-xl"
            : "border-stone-200/50 bg-white/65 shadow-[0_4px_20px_-8px_rgba(28,25,23,0.06)] backdrop-blur-md"
        }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="Sportivo home"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <img
            src="/images/sportivo-logo.png"
            alt="Sportivo Logo"
            width={34}
            height={34}
            className="h-8 w-8 rounded-lg object-cover ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-[17px] font-bold tracking-tight text-gray-900">
            Sport<span className="text-orange-600">ivo</span>
          </span>
        </Link>

        {/* Desktop Links + Mega Menus */}
        <div className="hidden items-center gap-7 md:flex">
          {/* Sports Mega-Menu */}
          <div className="group relative py-2">
            <Link
              href="/sports"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Sports
              <ChevronDown
                size={14}
                className="text-gray-400 transition-transform duration-200 group-hover:rotate-180"
              />
            </Link>
            <div className="invisible absolute left-1/2 top-full -mt-1 w-[40rem] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="absolute inset-x-0 -top-4 h-4 bg-transparent" />
              <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/95 p-2.5 shadow-[0_24px_60px_-15px_rgba(28,25,23,0.22)] backdrop-blur-xl">
                <div className="px-3 pb-2 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  Athletic Programmes
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {sportsMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group/card relative flex items-start gap-3 rounded-2xl p-3 transition-colors duration-150 hover:bg-stone-50"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-500 shadow-xs transition-all duration-150 group-hover/card:border-orange-200 group-hover/card:bg-orange-50 group-hover/card:text-orange-600">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                            {item.title}
                            <ArrowRight
                              size={14}
                              className="-translate-x-1 text-orange-500 opacity-0 transition-all duration-150 group-hover/card:translate-x-0 group-hover/card:opacity-100"
                            />
                          </div>
                          <div className="mt-0.5 text-xs leading-relaxed text-stone-500">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/coaches"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Coaches
          </Link>

          <Link
            href="/membership"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Membership
          </Link>

          {/* Platform & Portals Mega-Menu */}
          <div className="group relative py-2">
            <Link
              href="/about"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Academy & Portals
              <ChevronDown
                size={14}
                className="text-gray-400 transition-transform duration-200 group-hover:rotate-180"
              />
            </Link>
            <div className="invisible absolute left-1/2 top-full -mt-1 w-[40rem] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="absolute inset-x-0 -top-4 h-4 bg-transparent" />
              <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/95 p-2.5 shadow-[0_24px_60px_-15px_rgba(28,25,23,0.22)] backdrop-blur-xl">
                <div className="px-3 pb-2 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  Digital Operating System
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {platformMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group/card relative flex items-start gap-3 rounded-2xl p-3 transition-colors duration-150 hover:bg-stone-50"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-500 shadow-xs transition-all duration-150 group-hover/card:border-orange-200 group-hover/card:bg-orange-50 group-hover/card:text-orange-600">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                            {item.title}
                            <ArrowRight
                              size={14}
                              className="-translate-x-1 text-orange-500 opacity-0 transition-all duration-150 group-hover/card:translate-x-0 group-hover/card:opacity-100"
                            />
                          </div>
                          <div className="mt-0.5 text-xs leading-relaxed text-stone-500">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/login"
            className="px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
          >
            Sign in
          </Link>
          <InteractivePillButton
            href="/register"
            orbSize={34}
            className="px-4 py-2 text-sm"
          >
            <span>Start training</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </InteractivePillButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-stone-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {open && (
        <div className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="grid gap-1">
            {[
              ["Sports Programmes", "/sports"],
              ["Academy Coaches", "/coaches"],
              ["Membership Plans", "/membership"],
              ["Our Story & Method", "/about"],
              ["Contact Academy", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-orange-50 hover:text-orange-600"
              >
                <span>{label}</span>
                <ArrowRight size={14} className="text-stone-400" />
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-stone-200/80 pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full rounded-full border border-stone-200 py-2.5 text-center text-sm font-semibold text-gray-800 hover:bg-stone-50"
            >
              Sign in
            </Link>
            <InteractivePillButton
              href="/register"
              onClick={() => setOpen(false)}
              className="w-full py-2.5 text-sm"
            >
              <span>Start training</span>
              <ArrowRight size={14} />
            </InteractivePillButton>
          </div>
        </div>
      )}
    </header>
  );
}
