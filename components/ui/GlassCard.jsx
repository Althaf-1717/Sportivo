"use client";

import { cx } from "@/lib/utils";

/**
 * High-Performance Glass Card:
 * - 100% GPU compositor driven via pure CSS transitions
 * - Zero React re-renders on mouse movement
 * - Crisp crystalline border and restrained backdrop blur
 */
export function GlassCard({
  children,
  className = "",
  interactive = true,
  variant = "default", // "default" | "dark" | "elevated" | "accent"
  as: Component = "div",
  ...props
}) {
  const variants = {
    default:
      "bg-white/80 border-white/80 text-navy shadow-[0_8px_24px_-4px_rgba(7,11,20,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-white hover:bg-white/90 hover:shadow-[0_16px_36px_-6px_rgba(7,11,20,0.08)]",
    dark:
      "bg-[#070b14]/90 border-white/12 text-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-white/25 hover:bg-[#070b14]",
    elevated:
      "bg-white/90 border-white/95 text-navy shadow-[0_12px_32px_-6px_rgba(7,11,20,0.06),inset_0_1px_2px_rgba(255,255,255,1)] hover:bg-white",
    accent:
      "bg-gradient-to-br from-[#ff5500]/08 via-white/85 to-white/75 border-orange/20 text-navy shadow-[0_12px_32px_-6px_rgba(255,85,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)]",
  };

  return (
    <Component
      className={cx(
        "relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-200 ease-out",
        variants[variant] || variants.default,
        interactive && "hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {/* Specular Edge Highlight Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80"
      />
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
