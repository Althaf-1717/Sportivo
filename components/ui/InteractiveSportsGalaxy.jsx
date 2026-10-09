"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Trophy } from "lucide-react";

/**
 * Interactive 3D Cosmic Sports Galaxy:
 * - Inspired by OpenAI Astra cosmic galaxy animation
 * - Swirling 3D logarithmic spiral galaxy of sparkling luminous stars (Diamond White, Apex Amber, Electric Blue)
 * - 3D athletic sports ball particle core with real-time 3D rotation
 * - Interactive cursor tracking: 3D ball tilts, rotates, and deflects magnetically toward the cursor
 * - Toggleable sport modes: Football (Soccer), Basketball, Cricket, and Cosmic Galaxy
 * - 60 FPS hardware-accelerated Canvas with zero external dependencies
 */
export default function InteractiveSportsGalaxy() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeSport, setActiveSport] = useState("all"); // "all" | "football" | "basketball" | "cricket"
  const [isHovering, setIsHovering] = useState(false);

  // Mouse & rotation physics state
  const physicsRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0.15,
    targetRotY: 0,
    rotX: 0.15,
    rotY: 0,
    autoSpinSpeed: 0.008,
    ballOffsetX: 0,
    ballOffsetY: 0,
    targetOffsetX: 0,
    targetOffsetY: 0,
    isHovered: false,
    width: 600,
    height: 480,
  });

  // Sports modes definition
  const sports = [
    { id: "all", label: "Tri-Sport Galaxy", icon: "🌌" },
    { id: "football", label: "Football Core", icon: "⚽" },
    { id: "basketball", label: "Basketball Core", icon: "🏀" },
    { id: "cricket", label: "Cricket Seam", icon: "🏏" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let time = 0;

    // Pre-generate star particles for Galaxy + Sports Core
    const particles = [];
    const NUM_GALAXY_STARS = 460;
    const NUM_SPHERE_POINTS = 380;

    // 1. Generate Logarithmic Spiral Galaxy Arms (OpenAI Astra style)
    const NUM_ARMS = 3;
    const ARM_OFFSET = (Math.PI * 2) / NUM_ARMS;

    for (let i = 0; i < NUM_GALAXY_STARS; i++) {
      const arm = i % NUM_ARMS;
      // Distance from center with cubic distribution for dense bright core
      const distance = Math.pow(Math.random(), 1.6) * 190 + 25;
      const angle = distance * 0.038 + arm * ARM_OFFSET + (Math.random() - 0.5) * 0.45;

      // Galaxy plane height dispersion
      const zDispersion = (Math.random() - 0.5) * (40 * (distance / 200) + 12);

      // Star Color Palette: Diamond White (50%), Apex Amber (25%), Electric Blue (25%)
      const randColor = Math.random();
      let color = "#FFFFFF";
      let glowColor = "rgba(255,255,255,0.7)";
      if (randColor > 0.72) {
        color = "#FF8A00";
        glowColor = "rgba(255,138,0,0.85)";
      } else if (randColor > 0.45) {
        color = "#60A5FA";
        glowColor = "rgba(96,165,250,0.8)";
      }

      particles.push({
        type: "galaxy",
        baseX: Math.cos(angle) * distance,
        baseY: Math.sin(angle) * distance * 0.65, // tilted galaxy disc
        baseZ: zDispersion,
        x: 0,
        y: 0,
        z: 0,
        size: Math.random() * 2.2 + 0.8,
        color,
        glowColor,
        sparkleSpeed: Math.random() * 0.04 + 0.02,
        sparkleOffset: Math.random() * Math.PI * 2,
        hasFlare: Math.random() > 0.88, // 12% of stars have diffraction flare cross
      });
    }

    // 2. Generate 3D Spherical Sports Ball Core
    const BALL_RADIUS = 76;
    for (let i = 0; i < NUM_SPHERE_POINTS; i++) {
      // Golden Spiral Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / NUM_SPHERE_POINTS);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const sx = BALL_RADIUS * Math.sin(phi) * Math.cos(theta);
      const sy = BALL_RADIUS * Math.sin(phi) * Math.sin(theta);
      const sz = BALL_RADIUS * Math.cos(phi);

      // Identify sport features:
      // Equatorial cricket seam (|sz| < 6)
      const isCricketSeam = Math.abs(sz) < 5.5;
      // Basketball seams (latitudes + vertical ribs)
      const isBasketballSeam =
        Math.abs(sz) < 4 ||
        Math.abs(Math.sin(theta * 2)) < 0.12 ||
        Math.abs(Math.cos(phi) - 0.5) < 0.08 ||
        Math.abs(Math.cos(phi) + 0.5) < 0.08;
      // Football hexagonal facets
      const isFootballVertex = (i % 7 === 0);

      let color = "#FFFFFF";
      let glowColor = "rgba(255,255,255,0.7)";

      if (isCricketSeam) {
        color = "#FFFFFF";
        glowColor = "rgba(255,255,255,0.95)";
      } else if (isBasketballSeam) {
        color = "#FF7A00";
        glowColor = "rgba(255,122,0,0.9)";
      } else if (isFootballVertex) {
        color = "#38BDF8";
        glowColor = "rgba(56,189,248,0.9)";
      }

      particles.push({
        type: "sphere",
        baseX: sx,
        baseY: sy,
        baseZ: sz,
        x: 0,
        y: 0,
        z: 0,
        size: isCricketSeam || isBasketballSeam ? 2.4 : Math.random() * 1.8 + 0.9,
        color,
        glowColor,
        isCricketSeam,
        isBasketballSeam,
        isFootballVertex,
        sparkleSpeed: Math.random() * 0.05 + 0.03,
        sparkleOffset: Math.random() * Math.PI * 2,
        hasFlare: isFootballVertex || (isCricketSeam && i % 4 === 0),
      });
    }

    // Resize handling with devicePixelRatio for ultra-sharp Retina rendering
    function handleResize() {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      physicsRef.current.width = rect.width;
      physicsRef.current.height = rect.height;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Main 60 FPS Render Loop
    function render() {
      time += 0.016;
      const { width, height, isHovered } = physicsRef.current;

      // Clear Canvas with subtle deep obsidian space background
      ctx.clearRect(0, 0, width, height);

      // Deep galactic core glow
      const cx = width / 2 + physicsRef.current.ballOffsetX;
      const cy = height / 2 + physicsRef.current.ballOffsetY;

      const coreGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 140);
      coreGlow.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      coreGlow.addColorStop(0.2, "rgba(255, 122, 0, 0.15)");
      coreGlow.addColorStop(0.5, "rgba(37, 99, 235, 0.08)");
      coreGlow.addColorStop(1, "transparent");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();

      // Smooth physics interpolation (Magnetic damping)
      physicsRef.current.rotX += (physicsRef.current.targetRotX - physicsRef.current.rotX) * 0.06;
      physicsRef.current.rotY += (physicsRef.current.targetRotY - physicsRef.current.rotY) * 0.06;

      physicsRef.current.ballOffsetX +=
        (physicsRef.current.targetOffsetX - physicsRef.current.ballOffsetX) * 0.08;
      physicsRef.current.ballOffsetY +=
        (physicsRef.current.targetOffsetY - physicsRef.current.ballOffsetY) * 0.08;

      // Auto rotation when idle or gentle continuation
      physicsRef.current.targetRotY += physicsRef.current.autoSpinSpeed;

      const cosY = Math.cos(physicsRef.current.rotY);
      const sinY = Math.sin(physicsRef.current.rotY);
      const cosX = Math.cos(physicsRef.current.rotX);
      const sinX = Math.sin(physicsRef.current.rotX);

      const fov = 340;

      // Projected points pool
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Active sport filter
        let isVisible = true;
        let pColor = p.color;
        let pGlow = p.glowColor;
        let pSize = p.size;

        if (p.type === "sphere") {
          if (activeSport === "cricket") {
            if (!p.isCricketSeam && Math.random() > 0.4) isVisible = false;
            pColor = p.isCricketSeam ? "#FFFFFF" : "rgba(255,255,255,0.35)";
          } else if (activeSport === "basketball") {
            if (!p.isBasketballSeam && Math.random() > 0.4) isVisible = false;
            pColor = p.isBasketballSeam ? "#FF8A00" : "rgba(255,138,0,0.4)";
          } else if (activeSport === "football") {
            if (!p.isFootballVertex && Math.random() > 0.35) isVisible = false;
            pColor = p.isFootballVertex ? "#38BDF8" : "rgba(255,255,255,0.45)";
          }
        } else {
          // Galaxy particles slowly swirl with time
          if (activeSport !== "all" && Math.random() > 0.75) isVisible = false;
        }

        if (!isVisible) continue;

        // 3D rotation math around Y then X axis
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseX * sinY + p.baseZ * cosY;

        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = p.baseY * sinX + z1 * cosX;

        // Perspective projection
        const scale = fov / (fov + z2 + 80);
        const projX = cx + x1 * scale;
        const projY = cy + y2 * scale;

        // Interactive cursor repulsion / wave if mouse is hovering nearby
        let currentX = projX;
        let currentY = projY;

        if (isHovered) {
          const dx = projX - physicsRef.current.mouseX;
          const dy = projY - physicsRef.current.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90 && dist > 0) {
            const force = (90 - dist) / 90;
            currentX += (dx / dist) * force * 16;
            currentY += (dy / dist) * force * 16;
          }
        }

        // Star Twinkle & Brightness Pulsation
        const twinkle = Math.sin(time * 3 + p.sparkleOffset) * 0.3 + 0.7;
        const alpha = Math.max(0.15, Math.min(1, scale * 1.1 * twinkle));

        projected.push({
          x: currentX,
          y: currentY,
          z: z2,
          size: Math.max(0.6, pSize * scale),
          color: pColor,
          glowColor: pGlow,
          alpha,
          hasFlare: p.hasFlare,
        });
      }

      // Sort by depth (back to front) for accurate 3D occlusions
      projected.sort((a, b) => b.z - a.z);

      // Render projected stars & sparkles
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        ctx.globalAlpha = p.alpha;

        // Soft outer star glow
        ctx.fillStyle = p.glowColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Bright star core
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-Point Star Diffraction Cross Flare (OpenAI Astra visual hallmark)
        if (p.hasFlare && p.size > 1.6) {
          const flareLen = p.size * 3.8;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - flareLen, p.y);
          ctx.lineTo(p.x + flareLen, p.y);
          ctx.moveTo(p.x, p.y - flareLen);
          ctx.lineTo(p.x, p.y + flareLen);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [activeSport]);

  // Mouse Move Interaction Handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX; // -1 to 1
    const normY = (y - centerY) / centerY; // -1 to 1

    physicsRef.current.mouseX = x;
    physicsRef.current.mouseY = y;
    physicsRef.current.isHovered = true;

    // Tilt & rotate towards cursor
    physicsRef.current.targetRotY += normX * 0.025;
    physicsRef.current.targetRotX = normY * 0.45;

    // Magnetic ball displacement (follows cursor smoothly)
    physicsRef.current.targetOffsetX = normX * 24;
    physicsRef.current.targetOffsetY = normY * 20;

    setIsHovering(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    physicsRef.current.isHovered = true;
    physicsRef.current.autoSpinSpeed = 0.003; // slow down when user is interacting
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    physicsRef.current.isHovered = false;
    physicsRef.current.targetRotX = 0.15;
    physicsRef.current.targetOffsetX = 0;
    physicsRef.current.targetOffsetY = 0;
    physicsRef.current.autoSpinSpeed = 0.008; // return to normal idle spin
    setIsHovering(false);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[630px] md:ml-auto">
      {/* Container Frame with Deep Cosmic Obsidian Glass */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative aspect-[4/3] sm:aspect-[1.2/1] overflow-hidden rounded-[28px] bg-[#070b14] shadow-[0_28px_65px_rgba(7,11,20,.32)] border border-white/15 ring-1 ring-white/10 select-none cursor-grab active:cursor-grabbing"
      >
        {/* Hardware-Accelerated 60 FPS Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" />

        {/* Ambient Cosmic Corner Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b14]/70 via-transparent to-[#070b14]/30" />

        {/* Top Floating Badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-1.5 shadow-md backdrop-blur-md sm:left-5 sm:top-5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          <p className="text-[8.5px] font-extrabold uppercase tracking-[.22em] text-white/90">
            KINETIC 3D COSMOS · INTERACTIVE
          </p>
        </div>

        {/* Interactive Cursor Hint */}
        <div
          className={`pointer-events-none absolute top-4 right-4 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 backdrop-blur-md transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "opacity-60"
          }`}
        >
          <p className="text-[8px] font-bold text-white/70">
            {isHovering ? "✨ Cursor Tracking Active" : "👆 Move Cursor to Spin & Deflect"}
          </p>
        </div>

        {/* Interactive Sport Mode Pills */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 sm:bottom-5 sm:left-5 sm:right-5">
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/15 bg-[#070b14]/80 p-1.5 shadow-xl backdrop-blur-md">
            {sports.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => setActiveSport(sport.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[9.5px] font-bold transition-all duration-200 ${
                  activeSport === sport.id
                    ? "bg-gradient-to-r from-orange to-[#ea4600] text-white shadow-sm scale-105"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{sport.icon}</span>
                <span className="hidden xs:inline">{sport.label}</span>
              </button>
            ))}
          </div>

          {/* Session Focus Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/15 bg-[#070b14]/80 px-3.5 py-2 shadow-xl backdrop-blur-md text-right">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange/15 text-orange">
              <Trophy size={14} />
            </span>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-white/50">Next-Gen</p>
              <p className="text-[10px] font-extrabold text-white">60 FPS Motion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
