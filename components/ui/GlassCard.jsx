"use client";

import { useState, useRef, useCallback } from "react";
import { cx } from "@/lib/utils";

/**
 * Premium Glassmorphic Card with Dynamic Specular Reflection and Elevation:
 * - Multi-stage backdrop blur & translucent surface
 * - 1px crystalline perimeter border with inner specular reflection
 * - Dynamic cursor-tracked light reflection on hover (when interactive)
 * - Zero layout thrashing, GPU-accelerated CSS transforms
 */
export function GlassCard({
  children,
  className = "",
  interactive = true,
  variant = "default", // "default" | "dark" | "elevated" | "accent"
  tilt = false,
  as: Component = "div",
  ...props
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = useCallback((e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`,
      });
    }
  }, [interactive, tilt]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (tilt) {
      setTiltStyle({
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      });
    }
  }, [tilt]);

  const variants = {
    default: "bg-white/70 border-white/80 text-navy shadow-[0_10px_30px_-5px_rgba(7,11,20,0.05),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:border-white hover:bg-white/80 hover:shadow-[0_20px_40px_-10px_rgba(7,11,20,0.1),inset_0_1px_1px_rgba(255,255,255,1)]",
    dark: "bg-[#070b14]/85 border-white/12 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-white/20 hover:bg-[#070b14]/90",
    elevated: "bg-white/85 border-white/90 text-navy shadow-[0_16px_40px_-8px_rgba(7,11,20,0.08),inset_0_1px_2px_rgba(255,255,255,1)] hover:bg-white/95",
    accent: "bg-gradient-to-br from-[#ff5500]/10 via-white/80 to-white/70 border-orange/20 text-navy shadow-[0_14px_36px_-6px_rgba(255,85,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)]",
  };

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={tilt ? tiltStyle : undefined}
      className={cx(
        "relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300",
        variants[variant] || variants.default,
        interactive && !tilt && "hover:-translate-y-1.5",
        className
      )}
      {...props}
    >
      {/* Dynamic Specular Reflection Follower (Interactive Glass Highlight) */}
      {interactive && isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background:
              variant === "dark"
                ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.12), transparent 80%)`
                : `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.65), transparent 75%)`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
