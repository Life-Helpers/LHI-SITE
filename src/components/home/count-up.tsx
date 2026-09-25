"use client";

import { useEffect, useRef, useState } from "react";

/** Animates the number in a label like "1.5M+" or "400k+" from zero when it scrolls into view. */
export function CountUp({ value, duration = 1800, className }: { value: string; duration?: number; className?: string }) {
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : 0;
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;
  const [shown, setShown] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    setShown(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(target * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!match) return <span className={className}>{value}</span>;
  // Keep thousands separators ("400,000+") while counting.
  const grouped = match[2].includes(",");
  const number = grouped ? Math.round(shown ?? 0).toLocaleString("en-US") : (shown ?? 0).toFixed(decimals);
  const text = shown === null ? value : `${match[1]}${number}${match[3]}`;
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {text}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
