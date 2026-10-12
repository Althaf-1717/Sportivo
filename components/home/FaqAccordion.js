"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "What is Sportivo and how is it different from a typical coaching camp?",
    a: "Sportivo is Bengaluru’s structured athletic academy and digital training operating system for Cricket, Football, and Basketball. Unlike crowded 35-player camps, every Sportivo cohort is capped at a 1 : 6 coach-to-athlete ratio, and every session’s attendance, drill focus, and skill evaluation is tracked live in your athlete portal.",
  },
  {
    q: "Who can join Sportivo — beginners or competitive players?",
    a: "Both. We run dedicated cohorts for foundation beginners, intermediate school/college team athletes, and advanced tournament-ready players. During onboarding, your specialist coach assesses your baseline and assigns you to the exact cohort that matches your pace.",
  },
  {
    q: "How does the digital attendance and skill tracking portal work?",
    a: "Every athlete receives a unique Student ID and login to the Sportivo Athlete Portal. Coaches mark attendance at the turf and log regular evaluations across Technique, Fitness, and Match Awareness. Parents and athletes can follow progress charts and coach notes from any device.",
  },
  {
    q: "What membership plans are available and how do payments work?",
    a: "We offer three clear membership tiers — Basic, Standard (Most Popular), and Premium — across all sports. Payments are processed securely in INR via Razorpay with instant digital receipts and one-click renewals inside your dashboard.",
  },
  {
    q: "Can I switch cohorts or train in more than one sport?",
    a: "Yes. You can coordinate batch timing changes directly through your coach or academy admin, and multi-sport enrolments are supported right from your student dashboard.",
  },
  {
    q: "How do I book my first session?",
    a: "Click 'Start training' to create your free athlete profile in under a minute, pick your preferred sport (Cricket, Football, or Basketball), and choose your season plan.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">Got questions?</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Everything you and your family need to know before stepping onto the turf.
          </p>
        </div>

        <div className="mt-12 divide-y divide-stone-200/80 border-y border-stone-200/80">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="group relative">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-[-1rem] inset-y-0 -z-10 rounded-2xl bg-[linear-gradient(to_right,transparent,rgba(255,237,213,0.55)_22%,rgba(255,237,213,0.28)_60%,transparent)] transition-opacity duration-500 ${
                    isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`text-base font-bold tracking-tight transition-colors duration-200 sm:text-lg ${
                      isOpen
                        ? "text-orange-700"
                        : "text-gray-900 group-hover:text-orange-600"
                    }`}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 border-orange-500/30 bg-orange-600 text-white shadow-sm"
                        : "border-stone-300 text-stone-500 group-hover:border-orange-300 group-hover:text-orange-600"
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 text-sm leading-relaxed text-stone-600 sm:text-[15px]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
