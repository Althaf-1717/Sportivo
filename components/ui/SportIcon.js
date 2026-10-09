"use client";

import { Trophy } from "lucide-react";

/**
 * Modern floating SVG sports icons replacing traditional emojis.
 * Includes subtle floating animation and glowing gradients.
 */
export default function SportIcon({ sport = "", className = "h-7 w-7", floating = true }) {
  const sportKey = String(sport || "").toLowerCase().trim();
  const floatClass = floating ? "animate-float" : "";

  // Cricket: Bat, Ball & Stumps SVG
  if (sportKey.includes("cricket")) {
    return (
      <span className={`inline-flex items-center justify-center text-orange ${floatClass}`} title="Cricket" aria-label="Cricket">
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Cricket Bat */}
          <path d="m14 7 3-3a1.5 1.5 0 0 1 2 2l-3 3" />
          <path d="M5 21a2 2 0 0 1-2-2v-4a2 2 0 0 1 .6-1.4l9-9a2 2 0 0 1 2.8 0l1 1a2 2 0 0 1 0 2.8l-9 9A2 2 0 0 1 6 18v3Z" />
          {/* Cricket Ball with Seam */}
          <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" fillOpacity="0.2" />
          <path d="M17 17c.8.8 1.4 1.4 2 2" strokeWidth="1.5" />
        </svg>
      </span>
    );
  }

  // Football: Geometric Soccer Ball SVG
  if (sportKey.includes("football") || sportKey.includes("soccer")) {
    return (
      <span className={`inline-flex items-center justify-center text-blue ${floatClass}`} title="Football" aria-label="Football">
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 7 15 9.5 14 13.5 10 13.5 9 9.5" fill="currentColor" fillOpacity="0.2" />
          <path d="m12 7-1.5-4" />
          <path d="m15 9.5 3.5-1" />
          <path d="m14 13.5 2.5 3" />
          <path d="m10 13.5-2.5 3" />
          <path d="m9 9.5-3.5-1" />
        </svg>
      </span>
    );
  }

  // Basketball: Basketball Ribs & Seams SVG
  if (sportKey.includes("basketball") || sportKey.includes("hoop")) {
    return (
      <span className={`inline-flex items-center justify-center text-amber-500 ${floatClass}`} title="Basketball" aria-label="Basketball">
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
          <path d="M4.93 19.07a10 10 0 0 0 14.14 0" />
        </svg>
      </span>
    );
  }

  // Default Athletics / Trophy SVG
  return (
    <span className={`inline-flex items-center justify-center text-blue ${floatClass}`} title="Sports" aria-label="Sports">
      <Trophy className={className} strokeWidth={2} />
    </span>
  );
}
