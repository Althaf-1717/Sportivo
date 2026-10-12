"use client";

import Link from "next/link";
import { cx } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";
import InteractivePillButton from "./InteractivePillButton";

export function Button({
  href,
  variant = "primary",
  magnetic = false,
  className = "",
  children,
  ...props
}) {
  if (variant === "primary") {
    const primaryBtn = (
      <InteractivePillButton href={href} className={className} {...props}>
        {children}
      </InteractivePillButton>
    );
    return magnetic ? <MagneticButton>{primaryBtn}</MagneticButton> : primaryBtn;
  }

  const variantStyles = {
    secondary:
      "btn-secondary !text-gray-900 hover:!text-orange-700",
    glass:
      "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full border border-stone-200/90 bg-white/85 px-6 py-2.5 text-xs font-bold !text-gray-900 backdrop-blur-2xl shadow-xs transition-all duration-200 hover:border-orange-200 hover:bg-white hover:text-orange-700 hover:shadow-md hover:-translate-y-0.5 active:scale-98",
    "dark-glass":
      "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-gradient-to-br from-white/20 to-white/05 px-6 py-2.5 text-xs font-bold !text-white backdrop-blur-2xl shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.6),0_12px_32px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-white/50 hover:bg-white/25 hover:-translate-y-0.5 active:scale-98",
  };

  const classes = cx(variantStyles[variant] || variantStyles.secondary, className);

  const content = href ? (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  ) : (
    <button className={classes} {...props}>
      {children}
    </button>
  );

  if (magnetic) {
    return <MagneticButton>{content}</MagneticButton>;
  }

  return content;
}
