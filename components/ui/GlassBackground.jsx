"use client";

import { useEffect, useState } from "react";

/**
 * Atmospheric Glass Background Environment:
 * - Fluid undulating ambient light orbs (Apex Amber, Electric Cobalt, Emerald Aurora)
 * - Ultra-fine micro-noise texture to prevent banding and give physical frosted glass depth
 * - Zero CPU overhead: 100% GPU-accelerated CSS keyframe transforms
 */
export default function GlassBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none overflow-hidden select-none"
    >
      {/* Base Canvas Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8faff] via-[#f5f8fc] to-[#eff4fb]" />

      {/* Ambient Light Orbs with Deep Gaussian Dispersion */}
      <div
        className={`absolute -top-32 -left-24 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#ff5500]/16 via-[#ff7a00]/10 to-transparent blur-[120px] transition-opacity duration-1000 ${
          mounted ? "opacity-100 animate-float-slow" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      />

      <div
        className={`absolute top-[18%] -right-24 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-[#2563eb]/14 via-[#3b82f6]/08 to-transparent blur-[140px] transition-opacity duration-1000 ${
          mounted ? "opacity-100 animate-float-reverse" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      />

      <div
        className={`absolute bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#10b981]/10 via-[#06b6d4]/06 to-transparent blur-[130px] transition-opacity duration-1000 ${
          mounted ? "opacity-100 animate-float-delayed" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* Subtle Geometric Light Shimmer Ribbon */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.06),transparent_70%)]" />

      {/* Micro-mesh Grid Pattern for Tactile Depth */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
