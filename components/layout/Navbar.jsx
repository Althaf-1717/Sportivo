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
    <header className="relative z-30 border-b border-slate-100 bg-white">
      <div className="container-wide flex h-[76px] items-center justify-between gap-6">
        <Link href="/" aria-label="Sportivo home" className="flex shrink-0 items-center gap-2.5">
          <img src="/images/sportivo-logo.png" alt="Sportivo Logo" className="h-10 w-10 rounded-xl object-cover shadow-xs" />
          <span className="leading-tight">
            <span className="block text-[15px] font-black tracking-[-.04em] text-navy">SPORT<span className="text-orange">IVO</span></span>
            <span className="block text-[8px] font-bold tracking-[.22em] text-slate-400">SPORTS ACADEMY</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="text-[12px] font-medium text-slate-600 transition hover:text-blue">{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link href="/login" className="text-[12px] font-semibold text-navy transition hover:text-blue">Sign in</Link>
          <Button href="/register" className="!rounded-[9px] !px-4 !py-[10px]">Join the academy <ArrowUpRight size={14} /></Button>
        </div>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-navy md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      {open && <nav className="absolute left-0 right-0 top-full border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-lg md:hidden" aria-label="Mobile navigation"><div className="mx-auto flex max-w-6xl flex-col gap-1">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href} className="rounded-lg px-3 py-3 text-sm font-medium text-navy hover:bg-slate-50">{label}</Link>)}<Link onClick={() => setOpen(false)} href="/login" className="rounded-lg px-3 py-3 text-sm font-medium text-navy">Sign in</Link><Button href="/register" className="mt-2" onClick={() => setOpen(false)}>Join the academy <ArrowUpRight size={14} /></Button></div></nav>}
    </header>
  );
}
