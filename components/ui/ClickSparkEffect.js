"use client";

import { useEffect } from "react";
export default function ClickSparkEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    function handlePointerDown(e) {
      try {
        const target = e.target;
        if (!target || typeof target.closest !== "function") return;
        if (target.closest(".input-eye-btn")) return;
        const btn = target.closest("button, .btn-primary, .btn-secondary, [role='button'], input[type='submit']");
        if (!btn) return;
        const existingShines = btn.querySelectorAll(".btn-click-shine");
        existingShines.forEach(s => s.remove());
        const shine = document.createElement("span");
        shine.className = "btn-click-shine";
        btn.appendChild(shine);
        setTimeout(() => {
          if (shine.parentNode) shine.remove();
        }, 550);
      } catch {}
    }
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true
    });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);
  return null;
}
