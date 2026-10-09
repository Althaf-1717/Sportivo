export default function GlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none select-none overflow-hidden"
    >
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#f8fafc]" />

      {/* High-Performance Hardware-Accelerated Static Gradient Mesh (0 ongoing GPU repaints) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 8% 10%, rgba(255, 85, 0, 0.065) 0%, transparent 35%),
            radial-gradient(circle at 92% 18%, rgba(37, 99, 235, 0.075) 0%, transparent 42%),
            radial-gradient(circle at 45% 65%, rgba(16, 185, 129, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 80% 90%, rgba(37, 99, 235, 0.045) 0%, transparent 35%)
          `,
        }}
      />

      {/* Tactile micro-grid texture for physical depth */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
