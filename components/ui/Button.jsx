import Link from "next/link";
import { cx } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

export function Button({
  href,
  variant = "primary",
  magnetic = false,
  className = "",
  children,
  ...props
}) {
  const variantStyles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    glass:
      "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full border border-white/90 bg-white/75 px-6 py-2.5 text-xs font-bold text-navy backdrop-blur-2xl shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),0_8px_24px_-4px_rgba(7,11,20,0.06)] transition-all duration-200 hover:border-white hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 active:scale-98",
    "dark-glass":
      "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-gradient-to-br from-white/20 to-white/05 px-6 py-2.5 text-xs font-bold text-white backdrop-blur-2xl shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.6),0_12px_32px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-white/50 hover:bg-white/25 hover:-translate-y-0.5 active:scale-98",
  };

  const classes = cx(variantStyles[variant] || variantStyles.primary, className);

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
