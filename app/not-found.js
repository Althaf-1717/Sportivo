import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return <main className="grid min-h-[70vh] place-items-center bg-paper px-6"><div className="max-w-md text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-soft text-blue"><SearchX size={28} /></div><p className="eyebrow mt-6">404 · Out of bounds</p><h1 className="mt-2 text-3xl font-bold text-navy">We couldn’t find that page.</h1><p className="mt-3 text-sm leading-7 text-slate-500">The page may have moved, or the link may be mistyped.</p><Link className="btn-secondary mt-6" href="/"><ArrowLeft size={15} /> Back to home</Link></div></main>;
}
