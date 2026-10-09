import { cx } from "@/lib/utils";

export function Badge({ children, tone = "blue", className }) {
  const tones = {
    blue: "bg-blue-soft text-blue border border-blue/20",
    orange: "bg-orange/10 text-orange border border-orange/20",
    green: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    gray: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide shadow-2xs",
        tones[tone] || tones.blue,
        className
      )}
    >
      {children}
    </span>
  );
}
