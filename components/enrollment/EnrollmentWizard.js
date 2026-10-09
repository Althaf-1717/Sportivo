"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { money } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import SportIcon from "@/components/ui/SportIcon";

const steps = ["Sport", "Coach", "Membership", "Review"];

export default function EnrollmentWizard({ sports, coaches, plans, initialSport = "", initialPlan = "", razorpayConfigured = false }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sportId, setSportId] = useState(initialSport ? String(initialSport) : "");
  const [coachId, setCoachId] = useState("");
  const [planId, setPlanId] = useState(initialPlan ? String(initialPlan) : "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const chosenSport = sports.find((sport) => String(sport._id || sport.slug) === sportId);
  const availableCoaches = useMemo(() => coaches.filter((coach) => !chosenSport || coach.sport === chosenSport.name || coach.specialization?.toLowerCase().includes(chosenSport.name.toLowerCase()) || coach.sports?.some((item) => item.name === chosenSport.name)), [coaches, chosenSport]);
  const availablePlans = useMemo(() => plans.filter((plan) => !chosenSport || !plan.sport || plan.sport.name === chosenSport.name || plan.sport === chosenSport.name), [plans, chosenSport]);
  const chosenCoach = availableCoaches.find((coach) => String(coach.userId || coach.user?._id || coach._id || coach.slug) === coachId);
  const chosenPlan = availablePlans.find((plan) => String(plan._id || plan.slug) === planId);

  function selectSport(id) { setSportId(id); setCoachId(""); setPlanId(""); setMessage(""); }
  function stepForward() {
    setMessage("");
    if (step === 0 && !sportId) return setMessage("Choose a sport to continue.");
    if (step === 1 && !coachId) return setMessage("Choose a coach to continue.");
    if (step === 2 && !planId) return setMessage("Choose a membership plan to continue.");
    setStep((current) => Math.min(3, current + 1));
  }

  async function checkout() {
    if (!razorpayConfigured) { setMessage("Add matching Razorpay test keys to .env.local to enable checkout."); return; }
    setBusy(true); setMessage("");
    try {
      const orderResponse = await fetch("/api/payments/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sportId, coachId, planId }) });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || "Could not create a payment order.");
      const loaded = await new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Razorpay Checkout did not load. Check your connection and try again."));
        document.body.appendChild(script);
      });
      if (!loaded) throw new Error("Razorpay could not be loaded.");
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Sportivo Academy",
        description: `${chosenSport.name} · ${chosenPlan.name}`,
        order_id: order.id,
        theme: { color: "#155EEF" },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response) });
            const verified = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verified.error || "Payment verification failed.");
            setMessage("Payment verified. Your enrolment is active.");
            router.push("/dashboard/student/payments?success=1");
            router.refresh();
          } catch (error) { setMessage(error.message || "Payment verification failed."); }
        },
        modal: { ondismiss: () => setMessage("Checkout closed. Your membership has not been charged.") },
        prefill: {},
      };
      const checkoutWindow = new window.Razorpay(options);
      checkoutWindow.on("payment.failed", async (event) => {
        const orderId = event.error?.metadata?.order_id;
        if (orderId) await fetch("/api/payments/fail", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId }) }).catch(() => {});
        setMessage(event.error?.description || "Payment failed. Please try again.");
      });
      checkoutWindow.open();
    } catch (error) { setMessage(error.message || "We couldn’t start checkout. Please try again."); }
    finally { setBusy(false); }
  }

  return <section className="surface-card p-4 sm:p-7">
    <ol className="grid grid-cols-4 gap-2">{steps.map((label, index) => <li key={label} className="min-w-0"><div className={`flex items-center gap-2 ${index === step ? "text-blue" : index < step ? "text-emerald-700" : "text-slate-400"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold ${index === step ? "bg-blue text-white" : index < step ? "bg-emerald-50" : "bg-slate-100"}`}>{index < step ? <Check size={13} /> : `0${index + 1}`}</span><span className="hidden truncate text-[10px] font-semibold sm:block">{label}</span></div><div className={`mt-2 h-1 rounded-full ${index <= step ? "bg-orange" : "bg-slate-100"}`} /></li>)}</ol>
    <div className="mt-7 min-h-[290px]">
      {step === 0 && <><p className="text-sm font-bold text-navy">What would you like to play?</p><p className="mt-1 text-[11px] text-slate-500">Choose a programme that sounds like you.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{sports.map((sport) => { const id = String(sport._id || sport.slug); const active = sportId === id; return <button key={id} type="button" onClick={() => selectSport(id)} className={`rounded-xl border p-4 text-left transition ${active ? "border-blue bg-blue-soft" : "border-slate-200 hover:border-blue/40"}`}><div className="grid h-10 w-10 place-items-center rounded-xl bg-white"><SportIcon sport={sport.name} className="h-6 w-6" floating={true} /></div><span className="mt-3 block text-xs font-bold text-navy">{sport.name}</span><span className="mt-1 block text-[10px] leading-5 text-slate-500">{sport.description}</span></button>; })}</div></>}
      {step === 1 && <><p className="text-sm font-bold text-navy">Choose your coach.</p><p className="mt-1 text-[11px] text-slate-500">Meet someone who can help you find your game.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{availableCoaches.map((coach) => { const id = String(coach.userId || coach.user?._id || coach._id || coach.slug); const active = coachId === id; const name = coach.user?.name || coach.name; return <button key={id} type="button" onClick={() => { setCoachId(id); setMessage(""); }} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${active ? "border-blue bg-blue-soft" : "border-slate-200 hover:border-blue/40"}`}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-xs font-bold text-orange">{coach.initials || name?.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><span><span className="block text-xs font-bold text-navy">{name}</span><span className="mt-1 block text-[10px] text-slate-500">{coach.role || coach.specialization || chosenSport?.name}</span></span></button>; })}</div>{!availableCoaches.length && <p className="mt-4 text-xs text-slate-500">No coaches are available for this sport yet. Please check back soon.</p>}</>}
      {step === 2 && <><p className="text-sm font-bold text-navy">Pick your membership.</p><p className="mt-1 text-[11px] text-slate-500">Choose the length that gives your routine room to grow.</p><div className="mt-5 grid gap-3 lg:grid-cols-3">{availablePlans.map((plan, index) => { const id = String(plan._id || plan.slug); const active = planId === id; return <button key={id} type="button" onClick={() => { setPlanId(id); setMessage(""); }} className={`relative rounded-xl border p-4 text-left transition ${active ? "border-blue bg-blue-soft" : "border-slate-200 hover:border-blue/40"}`}><span className="text-[10px] font-bold uppercase tracking-[.12em] text-blue">{plan.name}</span><span className="mt-2 block text-xl font-bold tracking-[-.04em] text-navy">{money(plan.price)}</span><span className="mt-1 block text-[10px] text-slate-500">{plan.durationLabel || `${plan.duration} months`}</span><span className="mt-3 block text-[10px] leading-5 text-slate-500">{plan.description}</span>{index === 1 && <Badge className="mt-3">Most popular</Badge>}</button>; })}</div></>}
      {step === 3 && <><p className="text-sm font-bold text-navy">Review your choices.</p><p className="mt-1 text-[11px] text-slate-500">You’ll continue to secure Razorpay checkout.</p><div className="mt-5 rounded-2xl bg-paper p-5"><div className="grid gap-4 sm:grid-cols-3"><div><span className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">Sport</span><p className="mt-1 text-xs font-bold text-navy">{chosenSport?.name}</p></div><div><span className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">Coach</span><p className="mt-1 text-xs font-bold text-navy">{chosenCoach?.user?.name || chosenCoach?.name}</p></div><div><span className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">Membership</span><p className="mt-1 text-xs font-bold text-navy">{chosenPlan?.name} · {chosenPlan?.durationLabel || `${chosenPlan?.duration} months`}</p></div></div><div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4"><span className="text-[11px] font-semibold text-slate-600">Total due today</span><span className="text-lg font-bold text-navy">{money(chosenPlan?.price)}</span></div></div><p className="mt-4 flex items-center gap-2 text-[10px] text-slate-500"><ShieldCheck size={14} className="text-emerald-600" /> Payment details are handled by Razorpay. Your membership activates after server-side verification.</p></>}
    </div>
    {message && <p className={`mt-2 rounded-lg px-3 py-2 text-[11px] leading-5 ${message.includes("verified") ? "bg-emerald-50 text-emerald-700" : "bg-orange/10 text-orange"}`} role="status">{message}</p>}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">{step > 0 ? <button type="button" className="btn-secondary" onClick={() => { setStep((value) => value - 1); setMessage(""); }}><ArrowLeft size={14} /> Back</button> : <span className="text-[9px] text-slate-400">Coach and sport selection can be changed before payment.</span>}{step < 3 ? <button type="button" onClick={stepForward} className="btn-primary">Continue <ArrowRight size={14} /></button> : <button type="button" disabled={busy || !razorpayConfigured} onClick={checkout} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Preparing checkout…" : "Pay securely"} <ShieldCheck size={14} /></button>}</div>
    {step === 3 && !razorpayConfigured && <p className="mt-3 text-right text-[9px] text-slate-400">Razorpay test checkout is disabled until matching keys are configured in .env.local.</p>}
  </section>;
}
