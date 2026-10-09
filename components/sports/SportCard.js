import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

import SportIcon from "@/components/ui/SportIcon";

export default function SportCard({ sport, index = 0 }) {
  const image = sport.image || "";
  return (
    <Link
      href={`/sports/${sport.slug || sport._id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(7,11,20,0.05),inset_0_1px_1px_rgba(255,255,255,0.95)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white hover:bg-white/85 hover:shadow-[0_20px_45px_-10px_rgba(7,11,20,0.1),inset_0_1px_2px_rgba(255,255,255,1)]"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {image && (
          <Image
            src={image}
            alt={`${sport.name} training`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/15 to-transparent transition-opacity group-hover:opacity-80" />
        <div className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/90 bg-white/90 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <SportIcon sport={sport.name || sport.slug || index} className="h-6 w-6" floating={true} />
        </div>
        <Badge className="absolute right-4 top-4 !bg-white/90 !backdrop-blur-md !border-white/80 !text-navy shadow-xs">
          {sport.name}
        </Badge>
      </div>
      <div className="p-5">
        <p className="text-[13px] leading-6 text-slate-600 line-clamp-2">{sport.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 pt-3.5 text-[11px] font-bold text-orange">
          <span>Explore Programme</span>
          <ArrowUpRight size={15} className="transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
