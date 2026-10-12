"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Check, Sparkles, Trophy, Activity } from "lucide-react";

export default function AuthAnimatedPanel({ mode = "login" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = canvas.parentElement?.clientWidth || 640;
    let height = canvas.parentElement?.clientHeight || 900;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = null;
    let time = 0;

    const pointer = { x: width * 0.5, y: height * 0.5, tx: width * 0.5, ty: height * 0.5 };

    // Kinetic left-to-right sports trajectory particles
    const particles = Array.from({ length: 36 }, (_, i) => ({
      x: (i / 36) * width,
      y: height * (0.2 + ((i * 19) % 60) / 100),
      vx: 0.7 + (i % 5) * 0.35,
      size: 1.5 + (i % 4) * 1.1,
      phase: (i * 0.6) % (Math.PI * 2),
      color:
        i % 3 === 0
          ? "rgba(251, 146, 60, 0.85)"
          : i % 3 === 1
          ? "rgba(234, 88, 12, 0.75)"
          : "rgba(253, 224, 71, 0.65)",
    }));

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      time += 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient cursor-reactive ember spotlight
      const aura = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        20,
        pointer.x,
        pointer.y,
        Math.max(width, height) * 0.65
      );
      aura.addColorStop(0, "rgba(249, 115, 22, 0.28)");
      aura.addColorStop(0.45, "rgba(234, 88, 12, 0.12)");
      aura.addColorStop(1, "rgba(24, 17, 14, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // 2. Five flowing Left-to-Right Kinetic Athletic Energy Ribbons
      const ribbons = [
        { amp: 68, freq: 0.0045, speed: 1.25, yOffset: 0.28, color: "rgba(249, 115, 22, 0.34)", width: 2.5 },
        { amp: 85, freq: 0.0038, speed: 0.95, yOffset: 0.42, color: "rgba(251, 191, 36, 0.26)", width: 2.0 },
        { amp: 55, freq: 0.0052, speed: 1.55, yOffset: 0.56, color: "rgba(234, 88, 12, 0.42)", width: 3.0 },
        { amp: 95, freq: 0.0032, speed: 0.8, yOffset: 0.68, color: "rgba(253, 186, 116, 0.22)", width: 1.8 },
        { amp: 64, freq: 0.0048, speed: 1.15, yOffset: 0.78, color: "rgba(249, 115, 22, 0.28)", width: 2.2 },
      ];

      ribbons.forEach((r, idx) => {
        ctx.beginPath();
        ctx.lineWidth = r.width;
        ctx.strokeStyle = r.color;

        for (let x = 0; x <= width; x += 12) {
          const cursorPull =
            Math.exp(-Math.pow((x - pointer.x) / 220, 2)) *
            ((pointer.y - height * r.yOffset) * 0.28);
          const y =
            height * r.yOffset +
            Math.sin(x * r.freq - time * r.speed + idx * 1.3) * r.amp +
            Math.cos(x * r.freq * 0.6 - time * (r.speed * 0.7)) * (r.amp * 0.4) +
            cursorPull;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // 3. Rotating 3D Perspective Stadium Rings
      ctx.save();
      ctx.translate(width * 0.48, height * 0.5);
      for (let ring = 0; ring < 3; ring++) {
        ctx.save();
        ctx.rotate(time * (0.12 + ring * 0.05) + ring * 0.8);
        ctx.scale(1, 0.42 + ring * 0.08);
        ctx.beginPath();
        ctx.arc(0, 0, 150 + ring * 55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 146, 60, ${0.16 - ring * 0.035})`;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([14, 10]);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // 4. Left-to-Right Streaming Trajectory Nodes with Comet Trails
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx * 2.2;
          if (p.x > width + 30) {
            p.x = -20;
          }
        }
        const waveY =
          p.y +
          Math.sin(p.x * 0.006 - time * 1.4 + p.phase) * 32;

        // Comet tail streaming left-to-right
        const tailGrad = ctx.createLinearGradient(
          p.x - 36,
          waveY,
          p.x,
          waveY
        );
        tailGrad.addColorStop(0, "rgba(249, 115, 22, 0)");
        tailGrad.addColorStop(1, p.color);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = p.size * 0.85;
        ctx.beginPath();
        ctx.moveTo(p.x - 36, waveY);
        ctx.lineTo(p.x, waveY);
        ctx.stroke();

        // Glowing orb head
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, waveY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const isRegister = mode === "register";

  return (
    <aside className="relative hidden lg:flex lg:w-[54%] overflow-hidden bg-gradient-to-br from-[#19110d] via-[#27150c] to-[#431807] select-none animate-[authPanelSlideIn_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]">
      {/* Keyframes for Left-to-Right Panel & Staggered Content Reveal */}
      <style>{`
        @keyframes authPanelSlideIn {
          0% {
            opacity: 0;
            transform: translate3d(-64px, 0, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes authContentSlideRight {
          0% {
            opacity: 0;
            transform: translate3d(-36px, 0, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes authFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
      `}</style>

      {/* Interactive 60fps Left-to-Right Kinetic Sports Trajectory Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Warm Radial Ambient Highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-orange-500/25 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-amber-500/20 blur-[110px]"
      />

      {/* Curved Vertical White Wave Edge on the Right (Matches Image 5 silhouette) */}
      <svg
        className="pointer-events-none absolute -right-1 top-0 z-20 h-full w-24 text-white"
        viewBox="0 0 120 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M120,0 L120,1000 L28,1000 C98,790 -18,560 56,330 C98,195 32,85 72,0 Z"
          fill="currentColor"
        />
      </svg>

      {/* Foreground Content Container */}
      <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16 pr-24">
        {/* Top Brand Link */}
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-3 group animate-[authContentSlideRight_0.7s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]"
        >
          <img
            src="/images/sportivo-logo.png"
            alt="Sportivo Logo"
            className="h-10 w-10 rounded-xl object-cover shadow-lg ring-1 ring-white/25 transition-transform duration-200 group-hover:scale-105"
          />
          <div>
            <span className="block text-xl font-extrabold tracking-tight text-white">
              Sport<span className="text-orange-400">ivo</span>
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-orange-200/75">
              Athletic Academy
            </span>
          </div>
        </Link>

        {/* Center Headline + Kinetic Live Telemetry Card + Feature Checkmarks */}
        <div className="my-auto max-w-md py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-200 backdrop-blur-md animate-[authContentSlideRight_0.7s_cubic-bezier(0.22,1,0.36,1)_0.18s_both]">
            <Sparkles size={12} className="text-orange-400" />
            <span>2026 Season Operating System</span>
          </div>

          <h2 className="mt-5 text-4xl xl:text-[44px] font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-sm animate-[authContentSlideRight_0.75s_cubic-bezier(0.22,1,0.36,1)_0.26s_both]">
            {isRegister ? (
              <>
                Start your journey.
                <br />
                <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-white bg-clip-text text-transparent italic">
                  Elevate your game.
                </span>
              </>
            ) : (
              <>
                Train with precision.
                <br />
                <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-white bg-clip-text text-transparent italic">
                  Track every win.
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-[15px] leading-relaxed text-orange-100/80 animate-[authContentSlideRight_0.75s_cubic-bezier(0.22,1,0.36,1)_0.34s_both]">
            The unified athletic platform connecting specialist 1 : 6 coaching cohorts, live attendance check-ins, and verified skill evaluations.
          </p>

          {/* Floating Live Kinetic Telemetry Mini-Card (Unique to Sportivo) */}
          <div
            style={{ animation: "authFloat 5s ease-in-out infinite" }}
            className="mt-7 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] animate-[authContentSlideRight_0.8s_cubic-bezier(0.22,1,0.36,1)_0.42s_both]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/25 text-orange-300 border border-orange-400/30">
                  <Trophy size={17} />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">
                    Live Cohort Performance
                  </p>
                  <p className="text-[11px] text-orange-200/75">
                    Cricket · Football · Basketball
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                <Activity size={11} /> 96% Active
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
              <div className="rounded-xl bg-black/25 px-2.5 py-1.5">
                <p className="text-[10px] text-orange-200/65">Cohort Ratio</p>
                <p className="text-xs font-extrabold text-white">1 : 6 Max</p>
              </div>
              <div className="rounded-xl bg-black/25 px-2.5 py-1.5">
                <p className="text-[10px] text-orange-200/65">Skill Index</p>
                <p className="text-xs font-extrabold text-orange-300">+18.4%</p>
              </div>
              <div className="rounded-xl bg-black/25 px-2.5 py-1.5">
                <p className="text-[10px] text-orange-200/65">Portals</p>
                <p className="text-xs font-extrabold text-white">3 Synced</p>
              </div>
            </div>
          </div>

          {/* Staggered Left-to-Right Feature Bullets */}
          <ul className="mt-7 space-y-3 text-sm text-white/90 animate-[authContentSlideRight_0.8s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]">
            {[
              "Verified session attendance & coach feedback",
              "Real-time skill ratings across Fitness & Technique",
              "Instant access for Athletes, Coaches & Academy Admins",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/30 text-orange-200 backdrop-blur-xs ring-1 ring-orange-300/40">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Copyright */}
        <p className="text-xs text-orange-100/60 animate-[authContentSlideRight_0.8s_cubic-bezier(0.22,1,0.36,1)_0.58s_both]">
          © 2026 Sportivo Athletic Academy. Built for serious athletes.
        </p>
      </div>
    </aside>
  );
}
