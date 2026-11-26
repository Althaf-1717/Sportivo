"use client";

import { useEffect, useRef, useCallback } from "react";
export default function InteractiveSportsGalaxy() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const physicsRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0.12,
    targetRotY: 0,
    rotX: 0.12,
    rotY: 0,
    autoSpinSpeed: 0.0075,
    ballOffsetX: 0,
    ballOffsetY: 0,
    targetOffsetX: 0,
    targetOffsetY: 0,
    isHovered: false,
    width: 600,
    height: 520
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      alpha: true
    });
    if (!ctx) return;
    let animationFrameId;
    let time = 0;
    const particles = [];
    const NUM_GALAXY_STARS = 420;
    const NUM_SPHERE_POINTS = 360;
    const NUM_ARMS = 3;
    const ARM_OFFSET = Math.PI * 2 / NUM_ARMS;
    for (let i = 0; i < NUM_GALAXY_STARS; i++) {
      const arm = i % NUM_ARMS;
      const distance = Math.pow(Math.random(), 1.5) * 200 + 30;
      const angle = distance * 0.036 + arm * ARM_OFFSET + (Math.random() - 0.5) * 0.4;
      const zDispersion = (Math.random() - 0.5) * (36 * (distance / 200) + 12);
      const randColor = Math.random();
      let color = "#FFFFFF";
      let glowColor = "rgba(255, 255, 255, 0.85)";
      if (randColor > 0.75) {
        color = "#38BDF8";
        glowColor = "rgba(56, 189, 248, 0.8)";
      } else if (randColor > 0.6) {
        color = "#2563EB";
        glowColor = "rgba(37, 99, 235, 0.75)";
      } else if (randColor > 0.45) {
        color = "#93C5FD";
        glowColor = "rgba(147, 197, 253, 0.8)";
      }
      particles.push({
        type: "galaxy",
        baseX: Math.cos(angle) * distance,
        baseY: Math.sin(angle) * distance * 0.65,
        baseZ: zDispersion,
        size: Math.random() * 2.2 + 0.8,
        color,
        glowColor,
        sparkleSpeed: Math.random() * 0.04 + 0.02,
        sparkleOffset: Math.random() * Math.PI * 2,
        hasFlare: Math.random() > 0.85
      });
    }
    const BALL_RADIUS = 82;
    for (let i = 0; i < NUM_SPHERE_POINTS; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / NUM_SPHERE_POINTS);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const sx = BALL_RADIUS * Math.sin(phi) * Math.cos(theta);
      const sy = BALL_RADIUS * Math.sin(phi) * Math.sin(theta);
      const sz = BALL_RADIUS * Math.cos(phi);
      const isCricketSeam = Math.abs(sz) < 5.5;
      const isBasketballSeam = Math.abs(sz) < 4 || Math.abs(Math.sin(theta * 2)) < 0.12 || Math.abs(Math.cos(phi) - 0.5) < 0.08 || Math.abs(Math.cos(phi) + 0.5) < 0.08;
      const isFootballVertex = i % 7 === 0;
      let color = "#FFFFFF";
      let glowColor = "rgba(255, 255, 255, 0.85)";
      if (isCricketSeam) {
        color = "#FFFFFF";
        glowColor = "rgba(255, 255, 255, 0.95)";
      } else if (isBasketballSeam) {
        color = "#38BDF8";
        glowColor = "rgba(56, 189, 248, 0.9)";
      } else if (isFootballVertex) {
        color = "#2563EB";
        glowColor = "rgba(37, 99, 235, 0.85)";
      }
      particles.push({
        type: "sphere",
        baseX: sx,
        baseY: sy,
        baseZ: sz,
        size: isCricketSeam || isBasketballSeam ? 2.3 : Math.random() * 1.7 + 0.9,
        color,
        glowColor,
        isCricketSeam,
        isBasketballSeam,
        isFootballVertex,
        sparkleSpeed: Math.random() * 0.05 + 0.03,
        sparkleOffset: Math.random() * Math.PI * 2,
        hasFlare: isFootballVertex || isCricketSeam && i % 4 === 0
      });
    }
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
    function render() {
      time += 0.016;
      const {
        width,
        height,
        isHovered
      } = physicsRef.current;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2 + physicsRef.current.ballOffsetX;
      const cy = height / 2 + physicsRef.current.ballOffsetY;
      const maxRadius = Math.min(width, height) * 0.48;
      const spaceVoid = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxRadius);
      spaceVoid.addColorStop(0, "rgba(7, 11, 20, 0.96)");
      spaceVoid.addColorStop(0.4, "rgba(7, 11, 20, 0.75)");
      spaceVoid.addColorStop(0.75, "rgba(15, 23, 42, 0.28)");
      spaceVoid.addColorStop(1, "transparent");
      ctx.fillStyle = spaceVoid;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.fill();
      const coreGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 135);
      coreGlow.addColorStop(0, "rgba(255, 255, 255, 0.32)");
      coreGlow.addColorStop(0.3, "rgba(56, 189, 248, 0.2)");
      coreGlow.addColorStop(0.7, "rgba(37, 99, 235, 0.06)");
      coreGlow.addColorStop(1, "transparent");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 135, 0, Math.PI * 2);
      ctx.fill();
      physicsRef.current.rotX += (physicsRef.current.targetRotX - physicsRef.current.rotX) * 0.06;
      physicsRef.current.rotY += (physicsRef.current.targetRotY - physicsRef.current.rotY) * 0.06;
      physicsRef.current.ballOffsetX += (physicsRef.current.targetOffsetX - physicsRef.current.ballOffsetX) * 0.08;
      physicsRef.current.ballOffsetY += (physicsRef.current.targetOffsetY - physicsRef.current.ballOffsetY) * 0.08;
      physicsRef.current.targetRotY += physicsRef.current.autoSpinSpeed;
      const cosY = Math.cos(physicsRef.current.rotY);
      const sinY = Math.sin(physicsRef.current.rotY);
      const cosX = Math.cos(physicsRef.current.rotX);
      const sinX = Math.sin(physicsRef.current.rotX);
      const fov = 340;
      const projected = [];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseX * sinY + p.baseZ * cosY;
        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = p.baseY * sinX + z1 * cosX;
        const scale = fov / (fov + z2 + 80);
        const projX = cx + x1 * scale;
        const projY = cy + y2 * scale;
        let currentX = projX;
        let currentY = projY;
        if (isHovered) {
          const dx = projX - physicsRef.current.mouseX;
          const dy = projY - physicsRef.current.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100;
            currentX += dx / dist * force * 18;
            currentY += dy / dist * force * 18;
          }
        }
        const twinkle = Math.sin(time * 3 + p.sparkleOffset) * 0.3 + 0.7;
        const alpha = Math.max(0.18, Math.min(1, scale * 1.15 * twinkle));
        projected.push({
          x: currentX,
          y: currentY,
          z: z2,
          size: Math.max(0.6, p.size * scale),
          color: p.color,
          glowColor: p.glowColor,
          alpha,
          hasFlare: p.hasFlare
        });
      }
      projected.sort((a, b) => b.z - a.z);
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.glowColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.hasFlare && p.size > 1.5) {
          const flareLen = p.size * 3.8;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.85;
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
  }, []);
  const handleMouseMove = useCallback(e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;
    physicsRef.current.mouseX = x;
    physicsRef.current.mouseY = y;
    physicsRef.current.isHovered = true;
    physicsRef.current.targetRotY += normX * 0.035;
    physicsRef.current.targetRotX = normY * 0.5;
    physicsRef.current.targetOffsetX = normX * 32;
    physicsRef.current.targetOffsetY = normY * 26;
  }, []);
  const handleMouseEnter = useCallback(() => {
    physicsRef.current.isHovered = true;
    physicsRef.current.autoSpinSpeed = 0.003;
  }, []);
  const handleMouseLeave = useCallback(() => {
    physicsRef.current.isHovered = false;
    physicsRef.current.targetRotX = 0.12;
    physicsRef.current.targetOffsetX = 0;
    physicsRef.current.targetOffsetY = 0;
    physicsRef.current.autoSpinSpeed = 0.0075;
  }, []);
  return <div ref={containerRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative mx-auto w-full max-w-[560px] aspect-[4/3] sm:aspect-[1.15/1] select-none cursor-grab active:cursor-grabbing md:ml-auto" style={{
    touchAction: "none"
  }}>
      {}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" />
    </div>;
}
