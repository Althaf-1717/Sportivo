"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cx } from "@/lib/utils";

export default function InteractivePillButton({
  href,
  children,
  className = "",
  orbSize = 36,
  variant = "dark",
  ...props
}) {
  const ref = useRef(null);
  const [orb, setOrb] = useState({ x: 0, y: 0, active: false });

  const handlePointerMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOrb({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setOrb((prev) => ({ ...prev, active: false }));
  };

  const baseStyles =
    variant === "orange"
      ? "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold !text-white shadow-[0_14px_34px_-10px_rgba(234,88,12,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(234,88,12,0.75)] active:translate-y-0"
      : "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold !text-white shadow-[0_12px_34px_-12px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-950 hover:shadow-[0_18px_44px_-12px_rgba(249,115,22,0.5)] active:translate-y-0";

  const combinedClassName = cx(baseStyles, className);

  const innerContent = (
    <>
      {/* Cursor-following 3D Orange Orb (Clienter signature hover orb) */}
      <span
        aria-hidden="true"
        style={{
          width: `${orbSize}px`,
          height: `${orbSize}px`,
          left: `${orb.x}px`,
          top: `${orb.y}px`,
          transform: `translate(-50%, -50%) scale(${orb.active ? 1 : 0})`,
        }}
        className={cx(
          "pointer-events-none absolute z-0 rounded-full transition-transform duration-200 ease-out",
          variant === "orange"
            ? "bg-amber-400/90 ring-2 ring-white/80 shadow-[inset_0_-3px_6px_rgba(180,83,9,0.45),0_6px_18px_rgba(251,191,36,0.65)]"
            : "bg-orange-500 ring-2 ring-orange-200/85 shadow-[inset_0_-3px_6px_rgba(154,52,18,0.45),0_6px_16px_rgba(249,115,22,0.65)]"
        )}
      />
      {/* Crisp white foreground text & icons */}
      <span className="relative z-10 inline-flex items-center justify-center gap-2 !text-white">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        ref={ref}
        href={href}
        onPointerEnter={handlePointerMove}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={combinedClassName}
        {...props}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      onPointerEnter={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={combinedClassName}
      {...props}
    >
      {innerContent}
    </button>
  );
}
