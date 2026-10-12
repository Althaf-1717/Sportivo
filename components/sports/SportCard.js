import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SportIcon from "@/components/ui/SportIcon";

export default function SportCard({ sport, index = 0 }) {
  const image = sport.image || "";
  return (
    <Link
      href={`/sports/${sport.slug || sport._id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_16px_44px_-14px_rgba(28,25,23,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-[0_24px_60px_-14px_rgba(234,88,12,0.16)]"
    >
      <div className="relative h-52 overflow-hidden bg-stone-100">
        {image && (
          <Image
            src={image}
            alt={`${sport.name} training`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-stone-950/15 to-transparent" />
        <div className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/90 bg-white/95 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          <SportIcon sport={sport.name || sport.slug || index} className="h-6 w-6" floating={false} />
        </div>
        <span className="absolute right-4 top-4 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[11px] font-bold text-gray-900 shadow-xs backdrop-blur-md">
          1 : 6 Cohort
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors">
              {sport.name} Academy
            </h3>
            <span className="text-[11px] font-bold text-orange-600">
              0{index + 1}
            </span>
          </div>
          <p className="mt-2 text-xs leading-6 text-stone-600 line-clamp-2">
            {sport.description}
          </p>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-bold text-gray-900 group-hover:text-orange-600">
          <span>Explore programme & batches</span>
          <ArrowRight
            size={15}
            className="text-orange-600 transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
