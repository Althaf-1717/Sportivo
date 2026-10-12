export default function GlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none select-none overflow-hidden bg-[#FFF8F2]"
    >
      {/* Top Hero Radial Warm Orange Glow (Clienter signature ambient light) */}
      <div
        className="absolute inset-x-0 top-0 h-[46rem]"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -8%, rgba(234, 88, 12, 0.14), transparent 70%)",
        }}
      />

      {/* Right Mid-Page Soft Amber Orb */}
      <div className="absolute right-0 top-[26rem] h-[34rem] w-[34rem] rounded-full bg-amber-200/25 blur-[130px]" />

      {/* Left Lower-Page Soft Orange Orb */}
      <div className="absolute left-0 top-[68rem] h-[30rem] w-[30rem] rounded-full bg-orange-200/20 blur-[130px]" />

      {/* Subtle Warm Stone Dot Grid for Depth */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(28, 25, 23, 0.55) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
