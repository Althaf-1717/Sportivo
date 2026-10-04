"use client";

import { useEffect } from "react";

/**
 * Click Shine Effect:
 * - Sweeps a crisp beam of light / shine effect across any clicked button
 * - Zero sparks or heavy particles
 * - Confined cleanly strictly inside the button boundaries
 */
export default function ClickSparkEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    function handlePointerDown(e) {
      try {
        const target = e.target;
        if (!target || typeof target.closest !== "function") return;

        // Skip password eye toggles completely
        if (target.closest(".input-eye-btn")) return;

        // Find clicked button or interactive button element
        const btn = target.closest("button, .btn-primary, .btn-secondary, [role='button'], input[type='submit']");
        if (!btn) return;

        // Ensure button confines children
        const computedStyle = window.getComputedStyle(btn);
        if (computedStyle.position === "static") {
          btn.style.position = "relative";
        }
        btn.style.overflow = "hidden";

        // Remove any existing shine overlay in this button
        const existingShines = btn.querySelectorAll(".btn-click-shine");
        existingShines.forEach((s) => s.remove());

        // Create light shine beam element
        const shine = document.createElement("span");
        shine.className = "btn-click-shine";
        shine.style.borderRadius = computedStyle.borderRadius;
        btn.appendChild(shine);

        // Clean up shine element after animation finishes
        setTimeout(() => {
          if (shine.parentNode) shine.remove();
        }, 600);
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
