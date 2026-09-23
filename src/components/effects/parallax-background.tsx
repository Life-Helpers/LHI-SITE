"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * A faded photo behind a section that drifts with the page scroll. A wash of the page
 * background sits over it so the content on top stays readable in light and dark mode.
 */
export function ParallaxBackground({ src, strength = 0.25, children, className = "" }: { src: string; strength?: number; children: React.ReactNode; className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = imageRef.current;
    if (!section || !layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      // 0 when the section's centre is at the viewport centre; negative above, positive below.
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      layer.style.transform = `translate3d(0, ${(-offset * strength).toFixed(1)}px, 0) scale(1.15)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={sectionRef} className={`relative isolate overflow-hidden ${className}`}>
      <div ref={imageRef} aria-hidden="true" className="absolute inset-0 -z-20 scale-[1.15] will-change-transform">
        <Image src={src} alt="" fill sizes="100vw" className="object-cover opacity-80 dark:opacity-60" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-background/75 via-background/35 to-background/75" />
      {children}
    </div>
  );
}
