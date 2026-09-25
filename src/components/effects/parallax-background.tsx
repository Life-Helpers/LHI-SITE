"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * A photo behind a section that moves against the visitor: scroll down and the photo slides
 * down inside the section, scroll up and it slides up. With `mouse`, it also drifts away from
 * the pointer (move right, it moves left). The photo layer is larger than the section so its
 * edges never show. Motion is off for users who prefer reduced motion.
 */
export function ParallaxBackground({
  src,
  strength = 0.25,
  opacity = 0.5,
  mouse = false,
  children,
  className = "",
}: {
  src: string;
  strength?: number;
  /** Photo opacity, 0–1. */
  opacity?: number;
  /** Also move against the mouse pointer. */
  mouse?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = imageRef.current;
    if (!section || !layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let visible = false;
    let scrollY = 0;
    let pointer = { x: 0, y: 0 };
    const render = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      // 0 when the section's centre is at the viewport centre; negative above, positive below.
      scrollY = -(rect.top + rect.height / 2 - window.innerHeight / 2) * strength;
      layer.style.transform = `translate3d(${pointer.x.toFixed(1)}px, ${(scrollY + pointer.y).toFixed(1)}px, 0)`;
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(render);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      // -0.5 … 0.5 across the section; the photo moves the other way, up to 30px.
      pointer = { x: -((e.clientX - rect.left) / rect.width - 0.5) * 60, y: -((e.clientY - rect.top) / rect.height - 0.5) * 60 };
      schedule();
    };
    const onLeave = () => {
      pointer = { x: 0, y: 0 };
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(section);
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    if (mouse) {
      section.addEventListener("pointermove", onPointer);
      section.addEventListener("pointerleave", onLeave);
    }
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      section.removeEventListener("pointermove", onPointer);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [strength, mouse]);

  return (
    <div ref={sectionRef} className={`relative isolate overflow-hidden ${className}`}>
      <div
        ref={imageRef}
        aria-hidden="true"
        className={`absolute -inset-y-[30%] -z-10 will-change-transform ${mouse ? "-inset-x-12 transition-transform duration-500 ease-out" : "inset-x-0"}`}
      >
        <Image src={src} alt="" fill sizes="100vw" className="object-cover" style={{ opacity }} />
      </div>
      {children}
    </div>
  );
}
