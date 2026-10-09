"use client";

import { useRef, useCallback } from "react";
import { cx } from "@/lib/utils";

/**
 * High-Performance Magnetic Button:
 * - Direct DOM style mutation via transform3d (0 React re-renders)
 * - Restrained 4px spring deflection
 * - Immediate clean release on mouse leave
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.2,
  disabled = false,
  ...props
}) {
  const ref = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (disabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = Math.max(-5, Math.min(5, (e.clientX - centerX) * strength));
      const deltaY = Math.max(-5, Math.min(5, (e.clientY - centerY) * strength));

      ref.current.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    },
    [disabled, strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cx("inline-block transition-transform duration-150 ease-out will-change-transform", className)}
      {...props}
    >
      {children}
    </div>
  );
}
