import { ClipboardList } from "lucide-react";

export default function EmptyState({ title = "Nothing to show yet.", description = "Your information will appear here when it is available.", action }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-blue-soft text-blue"><ClipboardList size={18} /></span><h3 className="mt-4 text-sm font-bold text-navy">{title}</h3><p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-slate-500">{description}</p>{action && <div className="mt-4">{action}</div>}</div>;
}
