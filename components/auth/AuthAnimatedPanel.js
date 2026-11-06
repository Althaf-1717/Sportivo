import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Users, TrendingUp } from "lucide-react";

const portals = {
  student: {
    label: "Your training, connected",
    title: "A little progress. Every day.",
    description: "Your sessions, your coaches, and your next milestone. All in one place.",
    features: ["Follow your schedule", "Connect with your coach", "See your progress"],
  },
  coach: {
    label: "The coach workspace",
    title: "More time for your athletes.",
    description: "Keep your sessions organised and give every athlete a clear path forward.",
    features: ["Manage session attendance", "Know your athletes", "Share skill evaluations"],
  },
  admin: {
    label: "Academy management",
    title: "An academy that runs smoothly.",
    description: "Bring your people, programmes, and daily operations together in one calm workspace.",
    features: ["Organise your programmes", "Manage athletes and coaches", "Review academy activity"],
  },
};
const icons = [CalendarDays, Users, TrendingUp];

export default function AuthAnimatedPanel({ mode = "login", portal = "student" }) {
  const content = portals[portal] || portals.student;
  return (
    <aside className="relative hidden w-[46%] flex-col border-r border-stone-200/70 bg-[#fffaf5] p-10 lg:flex xl:p-12">
      <style>{`
        @keyframes portalEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .portal-intro { animation: portalEnter 650ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .portal-intro { animation: none; }
        }
      `}</style>
      <Link href="/" className="inline-flex w-fit items-center gap-3" aria-label="Sportivo home">
        <Image src="/images/sportivo-logo.png" alt="" width={40} height={40} className="rounded-xl" />
        <span className="text-xl font-semibold tracking-tight text-stone-900">Sport<span className="text-orange-600">ivo</span></span>
      </Link>

      <div className="portal-intro my-auto w-full max-w-md py-12">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-orange-700">{mode === "register" ? "Your next chapter starts here" : content.label}</p>
        <h2 className="mt-4 max-w-md text-4xl font-medium leading-[1.15] tracking-tight text-stone-900 xl:text-[42px]">
          {mode === "register" ? "Make room for your best game." : content.title}
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-stone-600">{content.description}</p>

        <PortalIllustration portal={portal} />

        <ul className="mt-7 divide-y divide-stone-200/70">
          {content.features.map((feature, index) => {
            const Icon = icons[index];
            return <li key={feature} className="flex items-center gap-3 py-3 text-sm text-stone-600"><Icon size={17} strokeWidth={1.5} className="shrink-0 text-orange-600" />{feature}</li>;
          })}
        </ul>
      </div>

      <Link href="/sports" className="inline-flex w-fit items-center gap-2 text-xs text-stone-500 transition-colors hover:text-orange-700">Explore the academy <ArrowUpRight size={14} /></Link>
    </aside>
  );
}


function PortalIllustration({ portal }) {
  const admin = portal === "admin";
  const coach = portal === "coach";
  const title = admin ? "Everything, in sync." : coach ? "Turn strategy into progress." : "Your next milestone awaits.";
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-orange-100 bg-white">
      <svg viewBox="0 0 480 270" role="img" aria-label={admin ? "Illustration of academy programmes connected to an admin control centre" : coach ? "Illustration of a coach tactical board with player positions and passing routes" : "Illustration of a student journey from training to a trophy milestone"} className="block h-auto w-full">
        <rect width="480" height="270" fill="#fffdf9" />
        <circle cx="240" cy="135" r="112" fill="#fff3e6" />
        {admin ? (
          <g>
            <path d="M100 76H185M295 76H380M100 196H185M295 196H380" fill="none" stroke="#fdba74" strokeWidth="2" strokeDasharray="5 6" />
            <rect x="153" y="44" width="174" height="180" rx="18" fill="white" stroke="#e7e2da" />
            <rect x="169" y="60" width="142" height="28" rx="8" fill="#fff7ed" />
            <text x="183" y="79" fontSize="11" fill="#9a3412">ACADEMY HQ</text>
            <circle cx="296" cy="74" r="4" fill="#ea580c" />
            <rect x="171" y="103" width="58" height="43" rx="8" fill="#f5f5f4" />
            <rect x="241" y="103" width="68" height="43" rx="8" fill="#ffedd5" />
            <path d="M177 196V177H194V196M207 196V165H224V196M237 196V155H254V196M267 196V167H284V196" fill="#fdba74" />
            <path d="M178 132L188 121L200 126L216 113" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
            {[{x:34,y:48,label:"People"},{x:351,y:48,label:"Plans"},{x:34,y:168,label:"Sessions"},{x:351,y:168,label:"Payments"}].map(({x,y,label})=><g key={label}><rect x={x} y={y} width="95" height="56" rx="13" fill="white" stroke="#e7e2da" /><circle cx={x+20} cy={y+18} r="5" fill="#fb923c" /><text x={x+13} y={y+42} fontSize="11" fill="#57534e">{label}</text></g>)}
          </g>
        ) : coach ? (
          <g>
            <rect x="70" y="35" width="340" height="201" rx="16" fill="white" stroke="#e7e2da" />
            <rect x="88" y="53" width="304" height="165" rx="8" fill="#fff7ed" stroke="#fed7aa" />
            <path d="M240 53V218M88 95H123V176H88M392 95H357V176H392" fill="none" stroke="#fed7aa" />
            <circle cx="240" cy="135" r="32" fill="none" stroke="#fed7aa" />
            <path d="M149 162Q202 168 240 103T331 128M240 103L275 181" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="5 6" />
            {[[149,162],[240,103],[331,128],[275,181]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="14" fill={i===1 ? "#ea580c" : "white"} stroke="#ea580c" /><text x={x} y={y+4} textAnchor="middle" fontSize="11" fill={i===1 ? "white" : "#c2410c"}>{i+1}</text></g>)}
            <rect x="282" y="218" width="140" height="30" rx="10" fill="#1c1917" /><text x="352" y="237" textAnchor="middle" fontSize="11" fill="white">Guide. Practice. Improve.</text>
          </g>
        ) : (
          <g>
            <path d="M70 211C145 211 127 155 204 155S273 91 345 91" fill="none" stroke="#fed7aa" strokeWidth="18" strokeLinecap="round" />
            <path d="M70 211C145 211 127 155 204 155S273 91 345 91" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="4 9" />
            {[[86,207,"Start"],[202,155,"Practice"],[292,108,"Grow"]].map(([x,y,label])=><g key={label}><circle cx={x} cy={y} r="12" fill="white" stroke="#ea580c" strokeWidth="2" /><path d={`M${x-5} ${y}l3 3 7-7`} fill="none" stroke="#ea580c" strokeWidth="2" /><text x={x} y={y+32} textAnchor="middle" fontSize="12" fill="#78716c">{label}</text></g>)}
            <rect x="325" y="40" width="90" height="105" rx="18" fill="white" stroke="#fed7aa" />
            <path d="M354 59H386V78Q386 97 370 97Q354 97 354 78ZM354 65H345V77Q345 87 357 87M386 65H395V77Q395 87 383 87M370 97V110M358 113H382" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinejoin="round" />
            <text x="370" y="132" textAnchor="middle" fontSize="10" fill="#9a3412">YOUR NEXT WIN</text>
            <path d="M98 70h12m-6-6v12M288 48h10m-5-5v10" stroke="#fdba74" strokeWidth="2" />
          </g>
        )}
      </svg>
      <p className="border-t border-orange-100 px-5 py-3 text-xs font-medium tracking-wide text-stone-500">{title}</p>
    </div>
  );
}
