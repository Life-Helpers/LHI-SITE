"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * A faded photo behind a section that moves against the page scroll: scroll down and the
 * photo slides down inside the section, scroll up and it slides up. The photo layer is taller
 * than the section so its edges never show. Motion is off for users who prefer reduced motion.
 */
export function ParallaxBackground({
  src,
  strength = 0.25,
  opacity = 0.5,
  children,
  className = "",
}: {
  src: string;
  strength?: number;
  /** Photo opacity, 0–1. */
  opacity?: number;
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
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      // 0 when the section's centre is at the viewport centre; negative above, positive below.
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      layer.style.transform = `translate3d(0, ${(-offset * strength).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });
    observer.observe(section);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={sectionRef} className={`relative isolate overflow-hidden ${className}`}>
      <div ref={imageRef} aria-hidden="true" className="absolute inset-x-0 -inset-y-[30%] -z-10 will-change-transform">
        <Image src={src} alt="" fill sizes="100vw" className="object-cover" style={{ opacity }} />
      </div>
      {children}
    </div>
  );
}
