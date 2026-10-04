import { cx } from "@/lib/utils";

export function Badge({ children, tone = "blue", className }) {
  const tones = {
    blue: "bg-blue-soft text-blue",
    orange: "bg-orange/10 text-orange",
    green: "bg-emerald-50 text-emerald-700",
    gray: "bg-slate-100 text-slate-500",
  };
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold", tones[tone], className)}>{children}</span>;
}
