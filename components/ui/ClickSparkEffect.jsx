"use client";

import { useEffect } from "react";

const LIQUID_COLORS = [
  "#ffffff", // Luminous liquid white
  "#ff9500", // Vibrant amber
  "#ffbe3b", // Radiant liquid gold
  "#60a5fa", // Glossy ocean blue
  "#38bdf8", // Electric cyan
  "#fef08a", // Soft droplet highlight
];

/**
 * Liquid Glass Interaction Engine:
 * - Transforms buttons into fluid liquid glass on click
 * - Produces expanding water ripple shockwaves & glossy droplet splashes
 * - Fully confined strictly INSIDE the clicked button boundaries
 */
export default function ClickSparkEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function handlePointerDown(e) {
      try {
        const target = e.target;
        if (!target || typeof target.closest !== "function") return;

        // Skip password eye toggles completely so they stay stable
        if (target.closest(".input-eye-btn")) return;

        // Find clicked button or interactive button element
        const btn = target.closest("button, .btn-primary, .btn-secondary, [role='button'], input[type='submit']");
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Apply jelly liquid squish animation to the button
        btn.classList.remove("liquid-clicked");
        void btn.offsetWidth; // Force reflow
        btn.classList.add("liquid-clicked");
        setTimeout(() => {
          btn.classList.remove("liquid-clicked");
        }, 460);

        // Ensure button confines children
        const computedStyle = window.getComputedStyle(btn);
        if (computedStyle.position === "static") {
          btn.style.position = "relative";
        }
        btn.style.overflow = "hidden";

        // Create localized canvas overlay inside the button
        const canvas = document.createElement("canvas");
        canvas.className = "pointer-events-none absolute inset-0 z-20 h-full w-full";
        canvas.style.borderRadius = computedStyle.borderRadius;
        canvas.width = Math.ceil(rect.width);
        canvas.height = Math.ceil(rect.height);

        btn.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          canvas.remove();
          return;
        }

        // 1. Expanding Liquid Ripple Waves
        const maxDist = Math.max(rect.width, rect.height) * 1.1;
        const waves = [
          { x: clickX, y: clickY, radius: 4, speed: 4.8, alpha: 0.85, width: 3.5, color: "#ffffff" },
          { x: clickX, y: clickY, radius: 1, speed: 3.4, alpha: 0.6, width: 2, color: "#ffbe3b" },
        ];

        // 2. Liquid Droplet Particles with specular highlight
        const particleCount = 22;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4.2 + 1.6;
          const color = LIQUID_COLORS[Math.floor(Math.random() * LIQUID_COLORS.length)];
          const size = Math.random() * 3.8 + 2;
          const isStar = Math.random() > 0.55;

          particles.push({
            x: clickX,
            y: clickY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size,
            initialSize: size,
            alpha: 1,
            decay: Math.random() * 0.038 + 0.022,
            friction: 0.94,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.3,
            isStar,
          });
        }

        let animId = null;

        function renderFrame() {
          if (!canvas.parentNode) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let activeWave = false;

          // Render Liquid Waves (concentric fluid rings)
          for (let i = 0; i < waves.length; i++) {
            const w = waves[i];
            if (w.alpha > 0 && w.radius < maxDist) {
              activeWave = true;
              w.radius += w.speed;
              w.alpha -= 0.045;

              ctx.save();
              ctx.globalAlpha = Math.max(0, w.alpha);
              ctx.strokeStyle = w.color;
              ctx.lineWidth = w.width;
              ctx.shadowColor = w.color;
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
              ctx.stroke();

              // Soft inner liquid tint
              ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
              ctx.fill();
              ctx.restore();
            }
          }

          let activeParticles = 0;

          // Render Liquid Droplets and Crystalline Sparks
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.alpha <= 0) continue;

            p.vx *= p.friction;
            p.vy *= p.friction;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;
            p.size = Math.max(0, p.initialSize * (p.alpha > 0 ? p.alpha : 0));

            if (p.alpha > 0 && p.size > 0.3) {
              activeParticles++;
              if (p.isStar) {
                drawStar(ctx, p.x, p.y, 4, p.size * 1.5, p.size * 0.45, p.color, p.alpha);
              } else {
                // Liquid droplet with specular highlight
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Specular reflection glint inside the droplet
                ctx.fillStyle = "#ffffff";
                ctx.globalAlpha = Math.min(1, p.alpha * 1.2);
                ctx.beginPath();
                ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.32, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            }
          }

          if (activeParticles > 0 || activeWave) {
            animId = requestAnimationFrame(renderFrame);
          } else {
            if (animId) cancelAnimationFrame(animId);
            canvas.remove();
          }
        }

        animId = requestAnimationFrame(renderFrame);

        // Safety cleanup after 800ms
        setTimeout(() => {
          if (animId) cancelAnimationFrame(animId);
          if (canvas.parentNode) canvas.remove();
        }, 800);
      } catch {
        // Safe fallback
      }
    }

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}
