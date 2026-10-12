"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck2,
  ChevronDown,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  Loader2,
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
const sectionName = {
  student: "STUDENT SPACE",
  coach: "COACH WORKSPACE",
  admin: "ACADEMY ADMIN",
};

export default function DashboardShell({ user, role, nav, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState(null);

  // Clear optimistic pending state as soon as pathname catches up
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  // Proactively prefetch all sibling dashboard routes on mount for instant tab switches
  useEffect(() => {
    nav.forEach((item) => {
      if (item.href && item.href !== pathname) {
        try {
          router.prefetch(item.href);
        } catch {
          // Ignore prefetch errors on older routers
        }
      }
    });
  }, [nav, pathname, router]);

  const effectivePath = pendingHref || pathname;
  const isNavigating = Boolean(pendingHref && pendingHref !== pathname);

  const current =
    nav.find((item) => item.href === effectivePath) ||
    nav.find(
      (item) =>
        item.href !== `/dashboard/${role}` &&
        effectivePath.startsWith(item.href)
    );
  const title = current?.label || "Overview";

  const sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-stone-200/80 bg-white/90 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_10px_35px_rgba(28,25,23,0.04)] transition-transform duration-200 lg:static lg:translate-x-0 ${
        collapsed ? "lg:w-[80px]" : "lg:w-[250px]"
      } ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
    >
      <div className="flex h-[74px] items-center justify-between border-b border-stone-100 px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative overflow-hidden rounded-xl border border-stone-200/80 bg-white p-0.5 shadow-2xs transition duration-200 group-hover:scale-105">
            <img
              src="/images/sportivo-logo.png"
              alt="Sportivo Logo"
              className="h-8 w-8 rounded-[9px] object-cover"
            />
          </div>
          {!collapsed && (
            <span className="leading-tight">
              <b className="block text-[13px] font-black tracking-wide text-gray-900">
                SPORT<span className="text-orange-600">IVO</span>
              </b>
              <small className="text-[8px] font-extrabold tracking-[.22em] text-stone-400">
                ATHLETIC ACADEMY
              </small>
            </span>
          )}
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 lg:hidden"
        >
          <X size={17} />
        </button>
      </div>

      <div className="px-5 pb-2 pt-6">
        <p
          className={`text-[9px] font-extrabold tracking-[.18em] text-stone-400 uppercase ${
            collapsed ? "lg:sr-only" : ""
          }`}
        >
          {sectionName[role]}
        </p>
      </div>

      <nav
        aria-label={`${role} dashboard navigation`}
        className="flex-1 overflow-y-auto px-3 pb-4"
      >
        {nav.map((item) => {
          const active =
            effectivePath === item.href ||
            (item.href !== `/dashboard/${role}` &&
              effectivePath.startsWith(`${item.href}/`));
          const isItemLoading = pendingHref === item.href && pathname !== item.href;
          const Icon = iconMap[item.icon] || Activity;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              title={collapsed ? item.label : undefined}
              onMouseEnter={() => {
                try {
                  router.prefetch(item.href);
                } catch {}
              }}
              onClick={() => {
                setMobileOpen(false);
                if (item.href !== pathname) {
                  setPendingHref(item.href);
                }
              }}
              className={`mb-1.5 flex items-center gap-3 rounded-full px-4 py-2.5 text-[11.5px] font-semibold transition-all duration-150 ${
                active
                  ? "bg-gradient-to-r from-orange-500/15 to-orange-500/5 !text-orange-600 shadow-xs border border-orange-500/25 backdrop-blur-md"
                  : "!text-stone-600 hover:bg-stone-100/80 hover:!text-gray-900"
              }`}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? "text-orange-600" : ""}
              />
              <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
              {isItemLoading && !collapsed ? (
                <Loader2
                  size={13}
                  className="ml-auto animate-spin text-orange-600"
                />
              ) : (
                active &&
                !collapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
                )
              )}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title={collapsed ? "Logout" : undefined}
          className="mb-1 flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-[11.5px] font-semibold text-stone-500 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={16} strokeWidth={1.8} />
          <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
        </button>
      </nav>

      <div className="border-t border-stone-100 p-3">
        <button
          className="hidden w-full items-center justify-center rounded-lg py-2 text-stone-400 hover:bg-stone-50 hover:text-gray-900 lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
        <div
          className={`mt-2 flex items-center gap-2.5 rounded-full border border-stone-200/80 bg-stone-50/80 p-2 shadow-2xs ${
            collapsed ? "lg:justify-center" : ""
          }`}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-600 to-amber-500 text-[10px] font-extrabold text-white shadow-2xs">
            {initials(user.name)}
          </span>
          {!collapsed && (
            <span className="min-w-0 pr-2">
              <b className="block truncate text-[10.5px] font-bold text-gray-900">
                {user.name}
              </b>
              <small className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                {role === "student" && user.studentId
                  ? `ID: #${user.studentId}`
                  : `${role} account`}
              </small>
            </span>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen lg:flex">
      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-gray-900/30 backdrop-blur-xs lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {sidebar}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-stone-200/80 bg-white/85 px-4 backdrop-blur-2xl shadow-2xs sm:px-7">
          {/* Instant Top Loading Bar on Tab Switch */}
          {isNavigating && (
            <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-orange-100">
              <div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-stone-200/80 text-gray-900 bg-white/80 hover:bg-white lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={17} />
            </button>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-stone-400">
                {role} dashboard
              </p>
              <h1 className="mt-0.5 text-[15.5px] font-black tracking-[-.03em] text-gray-900">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {role === "student" && user.studentId && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[11px] font-bold text-orange-600 shadow-2xs">
                ID: #{user.studentId}
              </span>
            )}
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-stone-200/90 bg-white/80 px-3.5 py-1.5 text-[10.5px] font-bold !text-stone-600 hover:bg-white hover:!text-gray-900 shadow-2xs sm:inline-flex"
            >
              Public site <ArrowUpRight size={13} />
            </Link>
            <NotificationBell />
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/85 p-1.5 pr-3 hover:bg-white shadow-2xs backdrop-blur-md"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-500/10 text-[9px] font-extrabold text-orange-600">
                  {initials(user.name)}
                </span>
                <span className="hidden max-w-28 truncate text-[10.5px] font-bold text-gray-900 sm:block">
                  {user.name}
                </span>
                <ChevronDown size={13} className="text-stone-400" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-stone-200/90 bg-white/95 p-2.5 shadow-2xl backdrop-blur-2xl">
                  <p className="px-2.5 pt-1.5 text-[11.5px] font-bold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="truncate px-2.5 text-[10px] text-stone-500 font-medium">
                    {user.email}
                  </p>
                  {user.studentId && (
                    <p className="mt-1 px-2.5 py-0.5 text-[10px] font-bold text-orange-600 bg-orange-500/10 border border-orange-500/20 rounded-md inline-block mx-2.5">
                      Student ID: #{user.studentId}
                    </p>
                  )}
                  <div className="my-2 border-t border-stone-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[11.5px] font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main
          className={`mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-8 transition-opacity duration-150 ${
            isNavigating ? "opacity-65" : "opacity-100"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
