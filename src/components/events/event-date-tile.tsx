import { monthShort, type CalendarEvent } from "@/data/observances";

/** Calendar-page style date tile (month over day). */
export function EventDateTile({
  event,
  size = "md",
  className = "",
  inverse = false,
}: {
  event: Pick<CalendarEvent, "start" | "area">;
  size?: "md" | "lg";
  className?: string;
  /** White tile for use on a red background. */
  inverse?: boolean;
}) {
  const month = monthShort(event.start);
  const day = Number(event.start.slice(8, 10));
  const lhi = event.area === "lhi" && !inverse;
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border text-center ${
        inverse ? "border-white bg-white text-foreground" : lhi ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
      } ${size === "lg" ? "h-24 w-24" : "h-16 w-16"} ${className}`}
    >
      <span className={`w-full py-0.5 text-[10px] font-semibold uppercase tracking-widest ${lhi ? "bg-black/25" : "bg-primary text-primary-foreground"}`}>{month}</span>
      <span className={`font-serif-display font-light leading-none ${size === "lg" ? "mt-1 text-5xl" : "mt-0.5 text-3xl"}`}>{day}</span>
    </div>
  );
}

export function countdownLabel(days: number) {
  if (days < 0) return "Happening now";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 14) return `In ${days} days`;
  if (days < 60) return `In ${Math.round(days / 7)} weeks`;
  return `In ${Math.round(days / 30)} months`;
}
