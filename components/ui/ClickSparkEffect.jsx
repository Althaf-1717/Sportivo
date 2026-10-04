"use client";

import { useEffect } from "react";

const SPARK_COLORS = [
  "#ffffff", // Crisp white spark
  "#ff7a00", // Vibrant orange
  "#ffbe3b", // Radiant gold
  "#38bdf8", // Electric cyan
  "#f43f5e", // Bright rose
  "#fef08a", // Pale yellow
];

/**
 * Confines spark effects strictly INSIDE the clicked button across the entire website.
 * No sparks spill outside the button boundaries.
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
      ctx.shadowBlur = 6;
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

        // Find clicked button or interactive button element
        const btn = target.closest("button, .btn-primary, .btn-secondary, [role='button'], input[type='submit']");
        if (!btn) return; // Keep sparks ONLY inside buttons!

        const rect = btn.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

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

        // Particle configuration for inside-button burst
        const particleCount = 20;
        const particles = [];
        const ring = {
          x: clickX,
          y: clickY,
          radius: 4,
          maxRadius: Math.max(rect.width, rect.height) * 0.75,
          color: "#ffffff",
          alpha: 0.8,
        };

        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4.5 + 1.8;
          const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
          const size = Math.random() * 3.5 + 2;
          const isStar = Math.random() > 0.4;

          particles.push({
            x: clickX,
            y: clickY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size,
            initialSize: size,
            alpha: 1,
            decay: Math.random() * 0.035 + 0.025,
            friction: 0.94,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.4,
            isStar,
          });
        }

        let animId = null;

        function renderFrame() {
          if (!canvas.parentNode) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Shockwave ripple
          if (ring.alpha > 0) {
            ring.radius += 3.5;
            ring.alpha -= 0.06;
            ctx.save();
            ctx.globalAlpha = Math.max(0, ring.alpha);
            ctx.strokeStyle = ring.color;
            ctx.lineWidth = 2;
            ctx.shadowColor = "#ff7a00";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          let activeCount = 0;

          // Render particles
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

            if (p.alpha > 0 && p.size > 0) {
              activeCount++;
              if (p.isStar) {
                drawStar(ctx, p.x, p.y, 4, p.size * 1.6, p.size * 0.5, p.color, p.alpha);
              } else {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            }
          }

          if (activeCount > 0 || ring.alpha > 0) {
            animId = requestAnimationFrame(renderFrame);
          } else {
            if (animId) cancelAnimationFrame(animId);
            canvas.remove();
          }
        }

        animId = requestAnimationFrame(renderFrame);

        // Safety cleanup after 750ms
        setTimeout(() => {
          if (animId) cancelAnimationFrame(animId);
          if (canvas.parentNode) canvas.remove();
        }, 750);
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
