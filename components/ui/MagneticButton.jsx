"use client";

import { useRef, useState, useCallback } from "react";
import { cx } from "@/lib/utils";

/**
 * Magnetic Button Interaction Wrapper:
 * - Subtly pulls button towards cursor when hovered (restrained 4px - 6px radius)
 * - Spring-back release on mouse leave
 * - 100% accessible: does not delay or interfere with click/keyboard events
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.25, // magnetic pull strength multiplier
  disabled = false,
  ...props
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (disabled || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      // Restrain max magnetic translation to 6px
      const clampedX = Math.max(-6, Math.min(6, deltaX));
      const clampedY = Math.max(-6, Math.min(6, deltaY));

      setPosition({ x: clampedX, y: clampedY });
    },
    [disabled, strength]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cx("inline-block transition-transform duration-200 ease-out", className)}
      style={{
        transform: isHovered
          ? `translate3d(${position.x}px, ${position.y}px, 0)`
          : "translate3d(0, 0, 0)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
