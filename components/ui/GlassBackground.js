export default function GlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none select-none overflow-hidden"
    >
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#f8fafc]" />

      {/* Atmospheric Liquid Silk Ribbons matching uploaded reference image */}
      {/* Left Silk Wave: Deep Teal / Emerald Liquid Ribbon */}
      <div
        className="absolute -top-[10%] -left-[15%] w-[85vw] h-[120vh] opacity-65 mix-blend-multiply filter blur-[54px] pointer-events-none transform -rotate-12"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 25% 35%, rgba(13, 148, 136, 0.28) 0%, rgba(15, 118, 110, 0.18) 45%, rgba(4, 47, 46, 0.08) 70%, transparent 85%),
            linear-gradient(135deg, rgba(20, 184, 166, 0.22) 0%, rgba(13, 148, 136, 0.15) 50%, transparent 80%)
          `,
        }}
      />

      {/* Right Silk Wave: Radiant Amber / Fiery Orange Liquid Ribbon */}
      <div
        className="absolute -top-[5%] -right-[15%] w-[80vw] h-[120vh] opacity-60 mix-blend-multiply filter blur-[52px] pointer-events-none transform rotate-12"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 75% 30%, rgba(255, 85, 0, 0.22) 0%, rgba(234, 88, 12, 0.14) 45%, rgba(154, 52, 18, 0.06) 75%, transparent 85%),
            linear-gradient(225deg, rgba(255, 122, 0, 0.18) 0%, rgba(255, 85, 0, 0.12) 55%, transparent 80%)
          `,
        }}
      />

      {/* Deep Central Refraction Ribbon */}
      <div
        className="absolute top-[40%] left-[20%] right-[20%] h-[60vh] opacity-40 filter blur-[70px] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 50% 50%, rgba(37, 99, 235, 0.08) 0%, rgba(13, 148, 136, 0.06) 50%, transparent 80%)
          `,
        }}
      />

      {/* Subtle Specular Curved Ribbon Lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,200 C300,50 600,600 1500,200"
          fill="none"
          stroke="url(#emerald-glow)"
          strokeWidth="3"
        />
        <path
          d="M0,700 C500,450 900,900 1600,450"
          fill="none"
          stroke="url(#amber-glow)"
          strokeWidth="3.5"
        />
        <defs>
          <linearGradient id="emerald-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#042f2e" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="amber-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5500" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ea580c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tactile micro-grid texture for physical depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.5) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

