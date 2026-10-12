"use client";

import { useEffect, useRef } from "react";

export default function GlassBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = {
      x: width * 0.5,
      y: height * 0.32,
      tx: width * 0.5,
      ty: height * 0.32,
      active: false,
      intensity: 0,
    };

    let rafId = null;
    const GRID_SIZE = 54;
    const WARP_RADIUS = 230;
    const MAX_DISPLACEMENT = 26;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame();
    };

    const getWarpedPoint = (gx, gy) => {
      if (pointer.intensity < 0.01 || prefersReducedMotion) {
        return { x: gx, y: gy, influence: 0 };
      }
      const dx = gx - pointer.x;
      const dy = gy - pointer.y;
      const distSq = dx * dx + dy * dy;
      const radiusSq = WARP_RADIUS * WARP_RADIUS;

      if (distSq >= radiusSq || distSq === 0) {
        return { x: gx, y: gy, influence: 0 };
      }

      const dist = Math.sqrt(distSq);
      const t = 1 - dist / WARP_RADIUS;
      // Smooth bell curve falloff for elastic magnetic lens effect
      const falloff = t * t * (3 - 2 * t) * pointer.intensity;
      const push = falloff * MAX_DISPLACEMENT;

      return {
        x: gx + (dx / dist) * push,
        y: gy + (dy / dist) * push,
        influence: falloff,
      };
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Soft cursor-following ambient orange radial aura
      if (pointer.intensity > 0.01 && !prefersReducedMotion) {
        const grad = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          10,
          pointer.x,
          pointer.y,
          WARP_RADIUS * 1.15
        );
        grad.addColorStop(
          0,
          `rgba(234, 88, 12, ${(0.11 * pointer.intensity).toFixed(3)})`
        );
        grad.addColorStop(
          0.5,
          `rgba(251, 146, 60, ${(0.05 * pointer.intensity).toFixed(3)})`
        );
        grad.addColorStop(1, "rgba(255, 248, 242, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      const cols = Math.ceil(width / GRID_SIZE) + 1;
      const rows = Math.ceil(height / GRID_SIZE) + 1;

      // Precompute warped grid vertices
      const points = new Array(rows + 1);
      for (let r = 0; r <= rows; r++) {
        points[r] = new Array(cols + 1);
        const gy = r * GRID_SIZE;
        for (let c = 0; c <= cols; c++) {
          const gx = c * GRID_SIZE;
          points[r][c] = getWarpedPoint(gx, gy);
        }
      }

      // 2. Draw base elastic grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(28, 25, 23, 0.055)";
      ctx.beginPath();

      // Horizontal lines
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const p = points[r][c];
          if (c === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }

      // Vertical lines
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const p = points[r][c];
          if (r === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();

      // 3. Highlight warped segments & intersections near cursor in warm orange
      if (pointer.intensity > 0.02 && !prefersReducedMotion) {
        for (let r = 0; r <= rows; r++) {
          for (let c = 0; c <= cols; c++) {
            const p = points[r][c];
            if (p.influence <= 0.04) continue;

            // Highlight right segment
            if (c < cols) {
              const pr = points[r][c + 1];
              const segInf = Math.max(p.influence, pr.influence);
              ctx.strokeStyle = `rgba(234, 88, 12, ${(segInf * 0.34).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pr.x, pr.y);
              ctx.stroke();
            }

            // Highlight bottom segment
            if (r < rows) {
              const pb = points[r + 1][c];
              const segInf = Math.max(p.influence, pb.influence);
              ctx.strokeStyle = `rgba(234, 88, 12, ${(segInf * 0.34).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.stroke();
            }

            // Glowing orange intersection node
            const radius = 1.4 + p.influence * 2.2;
            ctx.fillStyle = `rgba(234, 88, 12, ${(0.2 + p.influence * 0.65).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const tick = () => {
      const dx = pointer.tx - pointer.x;
      const dy = pointer.ty - pointer.y;
      pointer.x += dx * 0.18;
      pointer.y += dy * 0.18;

      const targetIntensity = pointer.active ? 1 : 0;
      pointer.intensity += (targetIntensity - pointer.intensity) * 0.12;

      drawFrame();

      const stillMoving =
        Math.abs(dx) > 0.25 ||
        Math.abs(dy) > 0.25 ||
        Math.abs(targetIntensity - pointer.intensity) > 0.01;

      if (stillMoving) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId && !prefersReducedMotion) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      if (!pointer.active) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.active = true;
      startLoop();
    };

    const onPointerLeave = () => {
      pointer.active = false;
      startLoop();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

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

      {/* Interactive Cursor-Warping Elastic Grid Canvas (Clienter-inspired background grid) */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
