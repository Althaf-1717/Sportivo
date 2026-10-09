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
      "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/70 px-5 py-2.5 text-xs font-bold text-navy backdrop-blur-xl shadow-sm transition-all duration-200 hover:border-white hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5 active:scale-98",
    "dark-glass":
      "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-xl shadow-md transition-all duration-200 hover:border-white/30 hover:bg-white/20 hover:-translate-y-0.5 active:scale-98",
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
