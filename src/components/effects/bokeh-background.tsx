/**
 * Decorative, slow-drifting red/orange bokeh orbs for depth behind the
 * dark/light glass surfaces. Purely presentational: aria-hidden, fixed
 * behind content, and its animations are disabled globally (see
 * globals.css) under prefers-reduced-motion or the in-page toggle.
 */
export function BokehBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -top-32 -left-24 h-96 w-96 animate-drift-1 rounded-full bg-[var(--orb-primary)] blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] animate-drift-2 rounded-full bg-[var(--orb-accent)] blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 animate-drift-3 rounded-full bg-[var(--orb-primary)] blur-3xl opacity-70" />
    </div>
  );
}
