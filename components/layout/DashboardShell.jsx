"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck2,
  ChevronDown,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { initials } from "@/lib/utils";
import NotificationBell from "@/components/layout/NotificationBell";

const iconMap = {
  overview: LayoutDashboard,
  students: Users,
  coaches: UserCheck,
  sports: Trophy,
  membership: CreditCard,
  "membership-plans": CreditCard,
  enrollments: ShieldCheck,
  attendance: CalendarCheck2,
  progress: TrendingUp,
  "student-progress": TrendingUp,
  payments: DollarSign,
  users: Users,
  settings: Settings,
  profile: UserCheck,
};
const sectionName = { student: "STUDENT SPACE", coach: "COACH WORKSPACE", admin: "ACADEMY ADMIN" };

export default function DashboardShell({ user, role, nav, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const current = nav.find((item) => item.href === pathname) || nav.find((item) => item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
  const title = current?.label || "Overview";

  const sidebar = <aside className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${collapsed ? "lg:w-[80px]" : "lg:w-[250px]"} ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
    <div className="flex h-[74px] items-center justify-between border-b border-slate-100 px-5"><Link href="/" className="flex items-center gap-2.5"><img src="/images/sportivo-logo.png" alt="Sportivo Logo" className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-xs" />{!collapsed && <span className="leading-tight"><b className="block text-[13px] font-black tracking-wide text-navy">SPORT<span className="text-orange">IVO</span></b><small className="text-[8px] font-bold tracking-[.2em] text-slate-400">ACADEMY</small></span>}</Link><button onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"><X size={17} /></button></div>
    <div className="px-5 pb-2 pt-6"><p className={`text-[9px] font-bold tracking-[.17em] text-slate-400 ${collapsed ? "lg:sr-only" : ""}`}>{sectionName[role]}</p></div>
    <nav aria-label={`${role} dashboard navigation`} className="flex-1 overflow-y-auto px-3 pb-4">
      {nav.map((item) => {
        const active = pathname === item.href || (item.href !== `/dashboard/${role}` && pathname.startsWith(`${item.href}/`));
        const Icon = iconMap[item.icon] || Activity;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            onClick={() => setMobileOpen(false)}
            className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-medium transition ${active ? "bg-blue-soft text-blue font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-navy"}`}
          >
            <Icon size={16} strokeWidth={active ? 2.4 : 1.8} />
            <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
            {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange" />}
          </Link>
        );
      })}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        title={collapsed ? "Logout" : undefined}
        className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-700"
      >
        <LogOut size={16} strokeWidth={1.8} />
        <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
      </button>
    </nav>
    <div className="border-t border-slate-100 p-3">
      <button className="hidden w-full items-center justify-center rounded-lg py-2 text-slate-400 hover:bg-slate-50 hover:text-navy lg:flex" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
      </button>
      <div className={`mt-2 flex items-center gap-2.5 rounded-xl bg-paper p-2.5 ${collapsed ? "lg:justify-center" : ""}`}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue text-[10px] font-bold text-white">{initials(user.name)}</span>
        {!collapsed && (
          <span className="min-w-0">
            <b className="block truncate text-[10px] text-navy">{user.name}</b>
            <small className="block text-[9px] font-semibold text-slate-500">
              {role === "student" && user.studentId ? `Student ID: #${user.studentId}` : `${role} account`}
            </small>
          </span>
        )}
      </div>
    </div>
  </aside>;

  return <div className="min-h-screen bg-paper lg:flex">{mobileOpen && <button className="fixed inset-0 z-30 bg-navy/25 lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}{sidebar}<div className="min-w-0 flex-1">
    <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-7">
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-navy lg:hidden" aria-label="Open navigation"><Menu size={17} /></button>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-slate-400">{role} dashboard</p>
          <h1 className="mt-0.5 text-[15px] font-bold tracking-[-.03em] text-navy">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {role === "student" && user.studentId && (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-blue/20 bg-blue-soft px-2.5 py-1 text-[11px] font-bold text-blue">
            ID: #{user.studentId}
          </span>
        )}
        <Link href="/" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold text-slate-500 hover:bg-slate-50 sm:inline-flex">Public site <ArrowUpRight size={13} /></Link>
        <NotificationBell />
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-2.5 hover:bg-slate-50">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-soft text-[9px] font-bold text-blue">{initials(user.name)}</span>
            <span className="hidden max-w-28 truncate text-[10px] font-semibold text-navy sm:block">{user.name}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-2 pt-1.5 text-[11px] font-bold text-navy truncate">{user.name}</p>
              <p className="truncate px-2 text-[10px] text-slate-500">{user.email}</p>
              {user.studentId && (
                <p className="mt-1 px-2 py-0.5 text-[10px] font-semibold text-blue bg-blue-soft/50 rounded-md inline-block mx-2">
                  Student ID: #{user.studentId}
                </p>
              )}
              <div className="my-1.5 border-t border-slate-100" />
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-8">{children}</main>
  </div></div>;
}
