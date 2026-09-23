/**
 * Dependency-free confetti "party popper": fires bursts of paper from both
 * bottom corners on a full-screen canvas, then removes itself.
 */
const COLORS = ["#eb161c", "#c05709", "#f5b301", "#ffffff", "#7d0c10", "#2e9d5b"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  tilt: number;
  shape: "rect" | "circle" | "ribbon";
}

export function firePoppers(duration = 3200) {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "90" });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return () => {};
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const pieces: Piece[] = [];
  const burst = (fromLeft: boolean, count: number) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = Math.max(0.7, Math.min(1.4, h / 800));
    for (let i = 0; i < count; i++) {
      const angle = ((fromLeft ? -60 : -120) + (Math.random() - 0.5) * 40) * (Math.PI / 180);
      const speed = (11 + Math.random() * 11) * scale;
      pieces.push({
        x: fromLeft ? w * 0.02 : w * 0.98,
        y: h * 0.98,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        tilt: Math.random() * Math.PI,
        shape: (["rect", "rect", "circle", "ribbon"] as const)[Math.floor(Math.random() * 4)],
      });
    }
  };

  const count = window.innerWidth < 640 ? 70 : 130;
  burst(true, count);
  burst(false, count);
  const second = window.setTimeout(() => {
    burst(true, count / 2);
    burst(false, count / 2);
  }, 450);

  const start = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const fade = Math.max(0, Math.min(1, (duration + 800 - elapsed) / 800));
    for (const p of pieces) {
      p.vy += 0.32;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx + Math.sin(p.tilt) * 0.6;
      p.y += p.vy;
      p.rotation += p.spin;
      p.tilt += 0.08;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "ribbon") {
        ctx.fillRect(-p.size / 2, -1.5, p.size * 1.6, 3);
      } else {
        ctx.fillRect(-p.size / 2, (-p.size / 2) * Math.abs(Math.cos(p.tilt)), p.size, p.size * 0.6 * Math.abs(Math.cos(p.tilt)) + 1);
      }
      ctx.restore();
    }
    if (elapsed < duration + 800) frame = requestAnimationFrame(tick);
    else cleanup();
  };
  frame = requestAnimationFrame(tick);

  function cleanup() {
    cancelAnimationFrame(frame);
    window.clearTimeout(second);
    window.removeEventListener("resize", resize);
    canvas.remove();
  }
  return cleanup;
}
