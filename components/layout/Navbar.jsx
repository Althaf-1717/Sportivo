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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="container-wide flex h-[76px] items-center justify-between gap-6">
        <Link href="/" aria-label="Sportivo home" className="group flex shrink-0 items-center gap-2.5">
          <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-0.5 shadow-xs transition duration-200 group-hover:scale-105 group-hover:border-orange/30">
            <img src="/images/sportivo-logo.png" alt="Sportivo Logo" className="h-9 w-9 rounded-[10px] object-cover" />
          </div>
          <span className="leading-tight">
            <span className="block text-[15px] font-black tracking-[-.04em] text-navy">SPORT<span className="text-orange">IVO</span></span>
            <span className="block text-[8px] font-extrabold tracking-[.24em] text-slate-400">ATHLETIC ACADEMY</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-3.5 py-2 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-navy"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="px-2 py-2 text-[12.5px] font-bold text-navy transition hover:text-orange">
            Sign in
          </Link>
          <Button href="/register" className="!rounded-xl !px-4 !py-[10px] !text-[12px] shadow-sm">
            Join the academy <ArrowUpRight size={14} />
          </Button>
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/90 text-navy transition hover:bg-slate-50 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav
          className="absolute left-0 right-0 top-full max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-slate-100 bg-white/95 px-5 pb-6 pt-3 shadow-2xl backdrop-blur-md lg:hidden animate-in fade-in slide-in-from-top-2 duration-150"
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
