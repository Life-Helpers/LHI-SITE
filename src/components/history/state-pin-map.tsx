"use client";

import * as m from "motion/react-m";

import { NIGERIA_VB_H as VB_H, NIGERIA_VB_W as VB_W, NIGERIA_VIEWBOX as VIEWBOX, useNigeriaLocations } from "@/lib/nigeria-map";

/** Where to drop the pin for each state LHI has expanded into, in the map's viewBox units (checked against the outlines). */
const STATE_PINS: Record<string, { x: number; y: number }> = {
  sokoto: { x: 178, y: 62 },
  kebbi: { x: 92, y: 132 },
  zamfara: { x: 217, y: 118 },
  katsina: { x: 318, y: 100 },
  bauchi: { x: 445, y: 195 },
  borno: { x: 640, y: 130 },
  yobe: { x: 522, y: 118 },
  adamawa: { x: 610, y: 300 },
  fct: { x: 278, y: 314 },
  ebonyi: { x: 330, y: 478 },
  plateau: { x: 425, y: 290 },
};

const NAMES: Record<string, string> = {
  sokoto: "Sokoto",
  kebbi: "Kebbi",
  zamfara: "Zamfara",
  katsina: "Katsina",
  bauchi: "Bauchi",
  borno: "Borno",
  yobe: "Yobe",
  adamawa: "Adamawa",
  fct: "Abuja (FCT)",
  ebonyi: "Ebonyi",
  plateau: "Plateau",
};

/**
 * A map of Nigeria for a road-map stop: the states opened at this milestone are
 * highlighted with a pin, and states reached earlier on the journey are shaded lightly.
 */
export function StatePinMap({
  states,
  earlier = [],
  compact = false,
}: {
  states: string[];
  earlier?: string[];
  compact?: boolean;
}) {
  const locations = useNigeriaLocations();
  const now = new Set(states);
  const before = new Set(earlier);
  const names = states.map((s) => NAMES[s] ?? s).join(", ");

  return (
    <div className="relative w-full">
      <svg viewBox={VIEWBOX} className="h-auto w-full" role="img" aria-label={`Map of Nigeria with a pin on ${names}`}>
        {locations.map((loc) => (
          <path
            key={loc.id}
            d={loc.path}
            className={`stroke-background [stroke-width:1.2] ${
              now.has(loc.id) ? "fill-accent" : before.has(loc.id) ? "fill-primary/35 dark:fill-primary/45" : "fill-muted-foreground/15"
            }`}
          >
            <title>{loc.name}</title>
          </path>
        ))}
      </svg>

      {states.map((id, i) => {
        const pin = STATE_PINS[id];
        if (!pin) return null;
        const { x, y } = pin;
        return (
          <m.span
            key={id}
            initial={{ y: -18, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.25 + i * 0.12 }}
            style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 32" className={compact ? "h-5 w-4 drop-shadow" : "h-9 w-7 drop-shadow-md"}>
              <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0Z" className="fill-primary" />
              <circle cx="12" cy="11.5" r="4.6" fill="white" />
            </svg>
            {!compact && (
              <span className="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
                {NAMES[id] ?? id}
              </span>
            )}
          </m.span>
        );
      })}
    </div>
  );
}
