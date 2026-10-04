import Link from "next/link";
import { ArrowRight, CalendarClock, CreditCard } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";
import EmptyState from "@/components/dashboard/EmptyState";
import MembershipCard from "@/components/membership/MembershipCard";
import { currentUser } from "@/lib/server-auth";
import { getStudentDashboard } from "@/lib/dashboard-data";
import { getMembershipPlans } from "@/lib/public-data";
import { dateLabel, money } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function StudentMembershipPage() {
  const user = await currentUser();
  const [data, plans] = await Promise.all([getStudentDashboard(user.id), getMembershipPlans()]);
  const active = data.currentEnrollment;
  return <div><PageIntro eyebrow="The plan you’re on" title="Membership" description="See your current plan, renewal date, and the options available for a fresh start." />{active ? <section className="mb-6 overflow-hidden rounded-2xl bg-navy p-6 text-white"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><span className="status-good">Active membership</span><h2 className="mt-3 text-2xl font-bold">{active.sport?.name} · {active.membershipPlan?.name}</h2><p className="mt-2 text-xs text-white/65">Coach {active.coach?.name || "Sportivo coaching team"} · {active.membershipPlan?.duration} month plan</p></div><div className="rounded-xl bg-white/10 p-4 sm:min-w-[200px]"><p className="flex items-center gap-2 text-[10px] text-white/60"><CalendarClock size={13} /> Membership expires</p><p className="mt-2 text-sm font-bold">{dateLabel(active.endDate)}</p><p className="mt-1 text-[10px] text-white/55">{money(active.membershipPlan?.price)} paid</p></div></div><div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-[10px] text-white/65"><Link className="inline-flex items-center gap-1 text-orange" href="/dashboard/student/payments"><CreditCard size={13} /> View payment history</Link><Link className="inline-flex items-center gap-1 text-white" href="/dashboard/student/attendance">See attendance <ArrowRight size={13} /></Link></div></section> : <EmptyState title="No active membership yet." description="When you’re ready, choose a sport and a plan that gives you room to build a routine." action={<Link className="btn-primary" href="/dashboard/student">Choose a programme <ArrowRight size={14} /></Link>} />}<h3 className="mb-3 mt-7 text-sm font-bold text-navy">Plans available at Sportivo</h3><div className="grid gap-4 md:grid-cols-3">{plans.slice(0, 3).map((plan, i) => <MembershipCard key={plan.slug || plan._id} plan={plan} featured={i === 1} />)}</div></div>;
}
