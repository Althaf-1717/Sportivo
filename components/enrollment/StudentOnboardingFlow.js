"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { money } from "@/lib/utils";
import SportIcon from "@/components/ui/SportIcon";

const steps = [
  { id: "plan", label: "01 Choose Plan", short: "Plan" },
  { id: "sport", label: "02 Choose Sport", short: "Sport" },
  { id: "coach", label: "03 Choose Coach", short: "Coach" },
  { id: "payment", label: "04 Razorpay Payment", short: "Payment" },
];

export default function StudentOnboardingFlow({ user, sports = [], coaches = [], plans = [] }) {
  const [step, setStep] = useState(0);

  // Deduplicate plans to the 3 clear academy tiers
  const uniquePlans = useMemo(() => {
    const defaultTiers = [
      {
        slug: "basic",
        name: "Basic",
        duration: 1,
        durationLabel: "1 month",
        classes: 30,
        price: 1499,
        description: "A focused start for a new routine. 30 days of training.",
        features: ["Small-group coaching", "Two sessions each week", "Monthly progress check-in", "Attendance & fitness log"],
      },
      {
        slug: "standard",
        name: "Standard",
        duration: 3,
        durationLabel: "3 months",
        classes: 90,
        price: 3999,
        description: "Room to build consistency and momentum. 90 days of training.",
        features: ["Everything in Basic", "Three sessions each week", "Priority coach feedback", "Match simulation drills"],
      },
      {
        slug: "premium",
        name: "Premium",
        duration: 6,
        durationLabel: "6 months",
        classes: 180,
        price: 6999,
        description: "A longer commitment to meaningful progress. 180 days of training.",
        features: ["Everything in Standard", "Personal development plan", "Match and performance review", "Full facilities access"],
      },
    ];

    return defaultTiers.map((tier) => {
      const match = plans.find(
        (p) => p.duration === tier.duration || p.name?.toLowerCase() === tier.name.toLowerCase()
      );
      return match ? { ...tier, ...match, name: tier.name } : tier;
    });
  }, [plans]);

  // Selections
  const [selectedPlanId, setSelectedPlanId] = useState("standard");
  const [selectedSportId, setSelectedSportId] = useState(() => {
    return sports[0] ? String(sports[0]._id || sports[0].slug) : "";
  });
  const [selectedCoachId, setSelectedCoachId] = useState("");

  // Payment modal & timer states
  const [showQrModal, setShowQrModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Derived chosen plan
  const chosenPlan = useMemo(() => {
    const target = String(selectedPlanId).toLowerCase();
    return (
      uniquePlans.find(
        (p) =>
          String(p._id) === selectedPlanId ||
          p.slug?.toLowerCase() === target ||
          p.name?.toLowerCase() === target
      ) ||
      uniquePlans.find((p) => p.name?.toLowerCase().includes("standard")) ||
      uniquePlans[0]
    );
  }, [uniquePlans, selectedPlanId]);

  // Derived chosen sport
  // Auto-scroll to top smoothly whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Derived chosen sport
  const chosenSport = useMemo(() => {
    if (!selectedSportId && sports.length > 0) return sports[0];
    return (
      sports.find((s) => String(s._id || s.slug) === selectedSportId) ||
      sports[0]
    );
  }, [sports, selectedSportId]);

  // Filter coaches specifically for the chosen sport (100% crash-proof)
  const availableCoaches = useMemo(() => {
    if (!chosenSport) return [];
    const sportNameLower = (chosenSport.name || "").toLowerCase();
    const sportSlug = (chosenSport.slug || "").toLowerCase();
    const sportIdStr = String(chosenSport._id || "");

    return coaches.filter((coach) => {
      // 1. Check coach.sports array
      if (Array.isArray(coach.sports) && coach.sports.length > 0) {
        const matchesSport = coach.sports.some((s) => {
          if (!s) return false;
          if (typeof s === "string") {
            const sLower = s.toLowerCase();
            return sLower === sportNameLower || sLower === sportSlug || s === sportIdStr;
          }
          if (typeof s === "object") {
            const sName = (s.name || "").toLowerCase();
            const sSlug = (s.slug || "").toLowerCase();
            const sId = String(s._id || "");
            return sName === sportNameLower || sSlug === sportSlug || sId === sportIdStr;
          }
          return false;
        });
        if (matchesSport) return true;
      }
      // 2. Check coach.sport string or specialization
      if (coach.sport && typeof coach.sport === "string" && coach.sport.toLowerCase().includes(sportNameLower)) return true;
      if (coach.specialization && typeof coach.specialization === "string" && coach.specialization.toLowerCase().includes(sportNameLower)) return true;
      return false;
    });
  }, [coaches, chosenSport]);

  const effectiveCoachId = useMemo(() => {
    const valid = availableCoaches.some((c) => String(c.userId || c.user?._id || c._id || c.slug) === selectedCoachId);
    if (valid) return selectedCoachId;
    const first = availableCoaches[0];
    return first ? String(first.userId || first.user?._id || first._id || first.slug) : "";
  }, [availableCoaches, selectedCoachId]);

  const chosenCoach = useMemo(() => {
    return availableCoaches.find((c) => String(c.userId || c.user?._id || c._id || c.slug) === effectiveCoachId) || availableCoaches[0];
  }, [availableCoaches, effectiveCoachId]);

  // Step 1: Select Plan (Selecting directly advances to Step 2!)
  function handleChoosePlanAndContinue(plan) {
    const id = String(plan.slug || plan._id || plan.name?.toLowerCase() || "");
    setSelectedPlanId(id);
    setStep(1); // Advance to Choose Sport
  }

  // Step 2: Select Sport (Selecting directly advances to Step 3!)
  function handleChooseSportAndContinue(sport) {
    const id = String(sport._id || sport.slug);
    setSelectedSportId(id);
    setStep(2); // Advance to Choose Coach
  }

  // Step 3: Select Coach (Selecting directly advances to Step 4!)
  function handleChooseCoachAndContinue(coach) {
    const id = String(coach.userId || coach.user?._id || coach._id || coach.slug);
    setSelectedCoachId(id);
    setStep(3); // Advance to Payment
  }

  // Step 4: Pay with Razorpay
  function handlePayWithRazorpay() {
    setPaymentError("");
    setSecondsLeft(5);
    setPaymentDone(false);
    setShowQrModal(true);
  }

  // 5-second countdown timer effect
  useEffect(() => {
    let timer;
    if (showQrModal && secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (showQrModal && secondsLeft === 0 && !paymentDone) {
      timer = setTimeout(async () => {
        try {
          const payload = {
            planId: String(chosenPlan?._id || chosenPlan?.slug || chosenPlan?.name?.toLowerCase() || ""),
            sportId: String(chosenSport?._id || chosenSport?.slug || ""),
            coachId: String(chosenCoach?.user?._id || chosenCoach?.userId || chosenCoach?._id || chosenCoach?.slug || ""),
          };

          const response = await fetch("/api/payments/razorpay-qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Payment verification failed.");

          setPaymentDone(true);

          // Force full reload to dashboard with congratulations message so sidebar unlocks!
          setTimeout(() => {
            window.location.href = "/dashboard/student?congratulations=1";
          }, 1200);
        } catch (err) {
          setPaymentError(err.message || "Failed to complete payment.");
        }
      }, 50);
    }
    return () => clearTimeout(timer);
  }, [showQrModal, secondsLeft, paymentDone, chosenPlan, chosenSport, chosenCoach]);

  const planPrice = chosenPlan?.price || 3999;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy via-navy/95 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange">
              <Sparkles size={12} /> Student Membership Setup
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to Sportivo Academy, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="mt-1.5 max-w-xl text-xs text-slate-300">
              Complete your academy setup in 4 steps: Choose your plan, select your sport, pick your coach, and pay securely via Razorpay UPI.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm sm:shrink-0">
            <Trophy size={20} className="text-orange" />
            <div className="text-left text-xs">
              <span className="block text-[10px] text-slate-400">Step {step + 1} of 4</span>
              <span className="font-bold text-white">{steps[step].short}</span>
            </div>
          </div>
        </div>

        {/* Steps Breadcrumbs (Clickable to switch anytime) */}
        <div className="mt-8 grid grid-cols-4 gap-2 border-t border-white/10 pt-5">
          {steps.map((s, idx) => {
            const isCompleted = idx < step;
            const isCurrent = idx === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(idx)}
                className={`flex flex-col text-left transition ${
                  isCurrent ? "text-orange" : isCompleted ? "text-emerald-400 hover:text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? "bg-orange text-navy"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    {isCompleted ? <Check size={11} strokeWidth={3} /> : idx + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </div>
                <div
                  className={`mt-2 h-1 w-full rounded-full transition-all ${
                    isCurrent ? "bg-orange" : isCompleted ? "bg-emerald-400" : "bg-white/10"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CHOOSE PLAN */}
      {step === 0 && (
        <section className="surface-card p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div>
            <p className="eyebrow">Step 1 of 4</p>
            <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">Choose your membership plan</h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Select the training commitment that best fits your weekly routine. You will pick your sport in the next step.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {uniquePlans.map((plan, index) => {
              const id = String(plan.slug || plan._id || plan.name.toLowerCase());
              const isSelected = String(chosenPlan?.slug || chosenPlan?.name).toLowerCase() === String(plan.slug || plan.name).toLowerCase();
              const isPopular = plan.name?.toLowerCase().includes("standard") || index === 1;

              return (
                <div
                  key={id}
                  onClick={() => handleChoosePlanAndContinue(plan)}
                  className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all ${
                    isSelected
                      ? "border-blue bg-blue-soft/50 shadow-md ring-2 ring-blue/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-orange px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue">{plan.name}</span>
                      <div
                        className={`grid h-5 w-5 place-items-center rounded-full border ${
                          isSelected ? "border-blue bg-blue text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-2xl font-black text-navy">{money(plan.price)}</span>
                      <span className="ml-1 text-[11px] text-slate-400">/ {plan.durationLabel || `${plan.duration} months`}</span>
                    </div>

                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                      <Calendar size={13} className="text-emerald-700 animate-float shrink-0" />
                      <span>Total Classes: {plan.duration === 1 ? "30 Days" : plan.duration === 3 ? "90 Days" : "180 Days"}</span>
                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {plan.description || "Comprehensive coaching and facility access for your selected sport."}
                    </p>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Included:</p>
                      <ul className="space-y-1.5 text-[11px] text-slate-600">
                        {(plan.features?.length > 0
                          ? plan.features
                          : [
                              "Small-group coaching sessions",
                              "Dedicated coach feedback",
                              "Attendance & performance tracking",
                              "Full academy facilities access",
                            ]
                        ).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <Check size={13} className="text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoosePlanAndContinue(plan);
                    }}
                    className={`mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-center text-xs font-bold transition shadow-sm ${
                      isSelected
                        ? "bg-blue text-white hover:bg-blue/90"
                        : "bg-navy text-white hover:bg-navy/90"
                    }`}
                  >
                    <span>Choose {plan.name} & Continue</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-xs text-slate-500">
              Selected Plan: <strong className="font-bold text-navy">{chosenPlan?.name}</strong> ({money(planPrice)})
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-primary !px-6"
            >
              Continue to Choose Sport <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: CHOOSE SPORT */}
      {step === 1 && (
        <section className="surface-card p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Step 2 of 4</p>
              <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">Which sport would you like to train in?</h2>
              <p className="mt-1.5 text-xs text-slate-500">
                Choose your discipline (Cricket, Football, Basketball). You will select your coach for this sport next.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Selected Plan: <span className="font-bold text-blue">{chosenPlan?.name}</span> ({money(planPrice)})
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sports.map((sport) => {
              const id = String(sport._id || sport.slug);
              const isSelected = String(chosenSport?._id || chosenSport?.slug) === id || selectedSportId === id;
              const sportNameLower = (sport.name || "").toLowerCase();
              const sportSlug = (sport.slug || "").toLowerCase();
              const sportIdStr = String(sport._id || "");

              const coachCount = coaches.filter((c) => {
                if (Array.isArray(c.sports) && c.sports.length > 0) {
                  return c.sports.some((s) => {
                    if (!s) return false;
                    if (typeof s === "string") {
                      const sLower = s.toLowerCase();
                      return sLower === sportNameLower || sLower === sportSlug || s === sportIdStr;
                    }
                    if (typeof s === "object") {
                      const sName = (s.name || "").toLowerCase();
                      const sSlug = (s.slug || "").toLowerCase();
                      const sId = String(s._id || "");
                      return sName === sportNameLower || sSlug === sportSlug || sId === sportIdStr;
                    }
                    return false;
                  });
                }
                if (c.sport && typeof c.sport === "string" && c.sport.toLowerCase().includes(sportNameLower)) return true;
                if (c.specialization && typeof c.specialization === "string" && c.specialization.toLowerCase().includes(sportNameLower)) return true;
                return false;
              }).length;

              return (
                <div
                  key={id}
                  onClick={() => handleChooseSportAndContinue(sport)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all ${
                    isSelected
                      ? "border-blue bg-blue-soft/60 shadow-md ring-2 ring-blue/20"
                      : "border-slate-200 bg-white hover:border-blue/40 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-paper">
                        <SportIcon sport={sport.name} className="h-7 w-7" floating={true} />
                      </div>
                      <div
                        className={`grid h-5 w-5 place-items-center rounded-full border ${
                          isSelected ? "border-blue bg-blue text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-navy group-hover:text-blue transition-colors">
                      {sport.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500 line-clamp-2">
                      {sport.description || `Specialist training sessions and drills in ${sport.name}.`}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400 block mb-2">
                      {coachCount > 0 ? `${coachCount} coaches available` : "Coaches available"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChooseSportAndContinue(sport);
                      }}
                      className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-center text-xs font-bold transition shadow-sm ${
                        isSelected
                          ? "bg-blue text-white hover:bg-blue/90"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>Select {sport.name} & Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button type="button" onClick={() => setStep(0)} className="btn-secondary">
              <ArrowLeft size={15} /> Back to Plans
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary !px-6"
            >
              Continue to Choose Coach <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: CHOOSE COACH (ONLY COACHES RELATED TO CHOSEN SPORT) */}
      {step === 2 && (
        <section className="surface-card p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Step 3 of 4</p>
              <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">
                Choose your {chosenSport?.name} coach
              </h2>
              <p className="mt-1.5 text-xs text-slate-500">
                Only coaches specializing in {chosenSport?.name} are displayed below. Pick the coach you want to train with.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Sport: <span className="font-bold text-blue">{chosenSport?.name}</span> · Plan:{" "}
              <span className="font-bold text-blue">{chosenPlan?.name}</span>
            </div>
          </div>

          {availableCoaches.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <p className="text-sm font-bold text-navy">No coaches found specifically for {chosenSport?.name || "this sport"}.</p>
              <p className="mt-1 text-xs text-slate-500">Please choose a different sport to see assigned academy coaches.</p>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary mt-4">
                &larr; Choose another sport
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {availableCoaches.map((coach) => {
                const id = String(coach.userId || coach.user?._id || coach._id || coach.slug);
                const isSelected = String(chosenCoach?.user?._id || chosenCoach?._id || chosenCoach?.slug) === id || selectedCoachId === id;
                const coachName = coach.user?.name || coach.name;
                const initials =
                  coach.initials ||
                  coachName
                    ?.split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("") ||
                  "FC";

                return (
                  <div
                    key={id}
                    onClick={() => handleChooseCoachAndContinue(coach)}
                    className={`flex cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all ${
                      isSelected
                        ? "border-blue bg-blue-soft/60 shadow-md ring-2 ring-blue/20"
                        : "border-slate-200 bg-white hover:border-blue/40 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {coach.image || coach.user?.image ? (
                        <img
                          src={coach.image || coach.user?.image}
                          alt={coachName}
                          className="h-12 w-12 shrink-0 rounded-2xl object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy text-sm font-bold text-orange shadow-inner">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-navy">{coachName}</h3>
                          <div
                            className={`grid h-5 w-5 place-items-center rounded-full border ${
                              isSelected ? "border-blue bg-blue text-white" : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>

                        <p className="mt-0.5 text-xs font-semibold text-blue">
                          {coach.specialization || `${chosenSport?.name} Specialist`}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                          {coach.bio || `Specialized coaching in technical development and performance for ${chosenSport?.name}.`}
                        </p>

                        {coach.experience > 0 && (
                          <span className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-paper px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            <Clock size={11} className="text-slate-400" /> {coach.experience} years experience
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseCoachAndContinue(coach);
                        }}
                        className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-center text-xs font-bold transition shadow-sm ${
                          isSelected
                            ? "bg-blue text-white hover:bg-blue/90"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>Select {coachName} & Continue</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">
              <ArrowLeft size={15} /> Back to Sports
            </button>
            <button
              type="button"
              disabled={availableCoaches.length === 0}
              onClick={() => setStep(3)}
              className="btn-primary !px-6"
            >
              Continue to Payment <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: PAYMENT SECTION */}
      {step === 3 && (
        <section className="surface-card p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div>
            <p className="eyebrow">Step 4 of 4</p>
            <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">Review & Complete Payment</h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Confirm your training program selections and pay securely using Razorpay UPI QR code.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Selections Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-paper/60 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Program Summary
                </h3>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-3.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Membership Plan</span>
                    <p className="mt-1 text-sm font-bold text-navy">{chosenPlan?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {chosenPlan?.duration === 1 ? "30 Days / Classes" : chosenPlan?.duration === 3 ? "90 Days / Classes" : "180 Days / Classes"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Selected Sport</span>
                    <p className="mt-1 text-sm font-bold text-navy">{chosenSport?.name}</p>
                    <p className="text-[11px] text-slate-500">Full facility & drills</p>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Coach</span>
                    <p className="mt-1 text-sm font-bold text-navy">{chosenCoach?.user?.name || chosenCoach?.name}</p>
                    <p className="text-[11px] text-slate-500">{chosenCoach?.specialization || "Academy Coach"}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-4">
                  <div>
                    <span className="text-xs font-bold text-slate-600">Total Due Today</span>
                    <p className="text-[10px] text-slate-400">Includes all coaching sessions and training tracking</p>
                  </div>
                  <span className="text-2xl font-black text-navy">{money(planPrice)}</span>
                </div>
              </div>

              {/* What happens next */}
              <div className="rounded-2xl border border-blue/20 bg-blue-soft/30 p-5">
                <h4 className="text-xs font-bold text-navy flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-blue" />
                  <span>Instant Membership Activation</span>
                </h4>
                <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-500" />
                    <span>Your Student ID #{user?.studentId || 10001} will be registered with your coach.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-500" />
                    <span>Full dashboard access unlocked: Coaches, Attendance, Progress, and Payments.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-500" />
                    <span>Downloadable official fee receipt available right in Payments.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment action card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-paper px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <Lock size={11} /> 256-bit Secure
                </span>

                <h3 className="mt-3 text-base font-bold text-navy">Pay via Razorpay UPI</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Fast 5-second QR verification. Scan or simulate payment to activate your program immediately.
                </p>

                <div className="mt-5 rounded-xl bg-paper p-4 text-center border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Amount to Pay</span>
                  <div className="mt-1 text-2xl font-black text-navy">{money(planPrice)}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Zero transaction fees</span>
                </div>

                {paymentError && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] font-semibold text-rose-700">
                    {paymentError}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handlePayWithRazorpay}
                  className="btn-primary w-full !py-3 shadow-md flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <QrCode size={16} />
                  <span>Pay with Razorpay (5s Fast QR)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary w-full !text-xs !py-2"
                >
                  <ArrowLeft size={13} /> Back to Coach
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RAZORPAY 5-SECOND FAST VERIFICATION MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/65 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center border border-slate-200">
            {!paymentDone ? (
              <>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-soft text-blue shadow-inner">
                  <QrCode size={24} />
                </div>

                <h3 className="mt-4 text-base font-extrabold text-navy">
                  Razorpay UPI Verification
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Processing payment for <strong className="text-navy">{chosenPlan?.name} ({chosenSport?.name})</strong>
                </p>

                {/* Simulated QR Code Canvas */}
                <div className="my-5 mx-auto w-48 h-48 rounded-2xl border-2 border-dashed border-slate-300 p-3 flex flex-col items-center justify-center bg-paper/50">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white rounded-xl shadow-inner">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm transition-colors duration-300 ${
                          (i * 7 + secondsLeft) % 3 === 0
                            ? "bg-navy"
                            : (i * 11) % 4 === 0
                            ? "bg-blue"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="rounded-xl bg-orange/10 border border-orange/20 p-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange">
                    <Clock size={15} className="animate-spin text-orange" />
                    <span>Verifying UPI Gateway: {secondsLeft}s</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Auto-confirming test transaction... Please keep this window open.
                  </p>
                </div>
              </>
            ) : (
              <div className="py-6">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-navy">
                  Payment Verified!
                </h3>
                <p className="mt-1.5 text-xs text-slate-500">
                  Membership activated successfully. Reloading your dashboard...
                </p>
                <div className="mt-4 inline-block h-1 w-24 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
