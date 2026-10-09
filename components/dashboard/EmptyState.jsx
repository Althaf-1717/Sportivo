import { ClipboardList } from "lucide-react";

export default function EmptyState({
  title = "Nothing to show yet.",
  description = "Your information will appear here when it is available.",
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/70 backdrop-blur-md px-6 py-12 text-center shadow-sm">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-soft/80 text-blue shadow-sm ring-1 ring-blue/20">
        <ClipboardList size={20} />
      </span>
      <h3 className="mt-4 text-sm font-bold text-navy">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[11px] leading-relaxed text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
