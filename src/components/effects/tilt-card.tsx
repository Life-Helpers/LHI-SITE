"use client";

import { useRef } from "react";

/**
 * Tilts its content in 3D towards the mouse pointer and follows the pointer with a soft light,
 * lifting the whole box while hovered. Mouse only; nothing moves for touch or reduced motion.
 */
export function TiltCard({ children, className = "", maxTilt = 10 }: { children: React.ReactNode; className?: string; maxTilt?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = "";
    el.style.setProperty("--glow", "0");
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      el.style.transform = `perspective(1000px) rotateX(${((0.5 - y) * maxTilt).toFixed(2)}deg) rotateY(${((x - 0.5) * maxTilt).toFixed(2)}deg) scale(1.03)`;
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--glow", "1");
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-[2rem] transition-opacity duration-300"
        style={{
          opacity: "var(--glow, 0)",
          background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.28), transparent 45%)",
          mixBlendMode: "soft-light",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] blur-2xl transition-opacity duration-300"
        style={{ opacity: "var(--glow, 0)", background: "radial-gradient(closest-side, rgba(255,214,120,0.55), transparent)" }}
      />
    </div>
  );
}
