import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

import SportIcon from "@/components/ui/SportIcon";

export default function SportCard({ sport, index = 0 }) {
  const image = sport.image || "";
  return <Link href={`/sports/${sport.slug || sport._id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue/30 hover:shadow-[0_14px_36px_rgba(11,31,58,.1)]">
    <div className="relative h-48 overflow-hidden bg-blue-soft">
      {image && <Image src={image} alt={`${sport.name} training`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />}
      <div className="absolute inset-0 bg-navy/15 transition-colors group-hover:bg-navy/10" />
      <div className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/80 bg-white/95 shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
        <SportIcon sport={sport.name || sport.slug || index} className="h-6 w-6" floating={true} />
      </div>
      <Badge className="absolute right-4 top-4 !bg-white/95 !text-navy">{sport.name}</Badge>
    </div>
    <div className="p-5">
      <p className="text-[13px] leading-6 text-slate-600">{sport.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold text-blue"><span>Discover {sport.name}</span><ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
    </div>
  </Link>;
}
