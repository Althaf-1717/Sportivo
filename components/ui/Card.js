import { cx } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 backdrop-blur-xl shadow-[0_14px_38px_-12px_rgba(28,25,23,0.06)] transition-all duration-300 hover:border-orange-300/80 hover:shadow-[0_22px_50px_-14px_rgba(234,88,12,0.12)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
