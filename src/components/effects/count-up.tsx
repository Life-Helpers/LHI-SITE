"use client";

import { useEffect, useRef, useState } from "react";

/** Parses "1.5M+" / "400,000+" / "11" into a numeric target + display parts. */
function parseTarget(raw: string) {
  const match = raw.match(/^([\d.,]+)(.*)$/);
  if (!match) return { value: 0, prefix: "", suffix: raw };
  const [, numeric, suffix] = match;
  const value = parseFloat(numeric.replace(/,/g, ""));
  const hasComma = numeric.includes(",");
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  return { value, suffix, hasComma, decimals };
}

function formatValue(
  value: number,
  { hasComma, decimals }: { hasComma?: boolean; decimals?: number },
) {
  const fixed = value.toFixed(decimals ?? 0);
  if (!hasComma) return fixed;
  const [whole, frac] = fixed.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${withCommas}.${frac}` : withCommas;
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const target = parseTarget(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.reducedMotion === "true";

    if (reducedMotion || !target.value) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target.value * eased;
          setDisplay(formatValue(current, target) + (target.suffix ?? ""));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} aria-live="polite">
      {display}
    </span>
  );
}
