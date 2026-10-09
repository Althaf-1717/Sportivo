"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  ["Sports", "/sports"],
  ["Coaches", "/coaches"],
  ["Membership", "/membership"],
  ["Our story", "/about"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_8px_30px_rgba(7,11,20,0.03)] transition-all">
      <div className="container-wide flex h-[76px] items-center justify-between gap-6">
        <Link href="/" aria-label="Sportivo home" className="group flex shrink-0 items-center gap-2.5">
          <div className="relative overflow-hidden rounded-2xl border border-white/90 bg-white p-0.5 shadow-2xs transition duration-200 group-hover:scale-105 group-hover:border-orange/30">
            <img src="/images/sportivo-logo.png" alt="Sportivo Logo" className="h-9 w-9 rounded-[12px] object-cover" />
          </div>
          <span className="leading-tight">
            <span className="block text-[15px] font-black tracking-[-.04em] text-navy">SPORT<span className="text-orange">IVO</span></span>
            <span className="block text-[8px] font-extrabold tracking-[.24em] text-slate-400">ATHLETIC ACADEMY</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1.5 lg:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-[12.5px] font-semibold text-slate-700 transition hover:bg-white/80 hover:text-navy hover:shadow-2xs"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="rounded-full px-4 py-2 text-[12.5px] font-bold text-navy transition hover:bg-white/70 hover:text-orange">
            Sign in
          </Link>
          <Button href="/register" className="!rounded-full !px-5 !py-[10px] !text-[12px] shadow-sm">
            Join the academy <ArrowUpRight size={14} />
          </Button>
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/90 bg-white/80 text-navy transition hover:bg-white shadow-2xs lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav
          className="absolute left-0 right-0 top-full max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-white/80 bg-white/90 px-5 pb-6 pt-3 shadow-2xl backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-150"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1.5">
            {links.map(([label, href]) => (
              <Link
                onClick={() => setOpen(false)}
                key={href}
                href={href}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
              >
                {label}
              </Link>
            ))}
            <Link
              onClick={() => setOpen(false)}
              href="/login"
              className="rounded-xl px-3 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
            >
              Sign in
            </Link>
            <Button href="/register" className="mt-2 w-full !py-3" onClick={() => setOpen(false)}>
              Join the academy <ArrowUpRight size={14} />
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
