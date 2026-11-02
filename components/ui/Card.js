import { cx } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[20px] border border-stone-200/90 bg-white/95 backdrop-blur-xl shadow-[var(--surface-shadow)] transition-all duration-300 hover:border-orange-300/80 hover:shadow-[var(--surface-shadow-hover)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
