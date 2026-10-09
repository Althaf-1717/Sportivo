import { cx } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(7,11,20,0.05),inset_0_1px_1px_rgba(255,255,255,0.95)] transition-all duration-300 hover:border-white hover:bg-white/85 hover:shadow-[0_18px_40px_-10px_rgba(7,11,20,0.09)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
