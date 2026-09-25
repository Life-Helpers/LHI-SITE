"use client";

import { siteConfig } from "@/config/site";
import { NIGERIA_VB_H as VB_H, NIGERIA_VB_W as VB_W, NIGERIA_VIEWBOX as VIEWBOX, useNigeriaLocations } from "@/lib/nigeria-map";

export type Office = (typeof siteConfig.offices)[number];

// The @svg-maps outline is an equirectangular projection of Nigeria's extent,
// so a city's latitude/longitude maps linearly onto the viewBox.
const LNG_MIN = 2.67;
const LNG_MAX = 14.68;
const LAT_MIN = 4.27;
const LAT_MAX = 13.89;

export function projectToMap({ lat, lng }: { lat: number; lng: number }) {
  return {
    x: ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * VB_W,
    y: ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VB_H,
  };
}

const OFFICE_STATES = new Set<string>(siteConfig.offices.map((o) => o.mapStateId));

export function OfficePresenceMap({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const locations = useNigeriaLocations();
  const selected = siteConfig.offices.find((o) => o.id === selectedId);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <svg viewBox={VIEWBOX} className="h-auto w-full" role="img" aria-label="Map of Nigeria showing Life Helpers Initiative's 11 state offices">
        {locations.map((loc) => {
          const hasOffice = OFFICE_STATES.has(loc.id);
          const active = selected?.mapStateId === loc.id;
          return (
            <path
              key={loc.id}
              d={loc.path}
              className={`stroke-background transition-colors duration-300 [stroke-width:1.2] ${
                active ? "fill-primary" : hasOffice ? "fill-primary/30 dark:fill-primary/40" : "fill-muted-foreground/15"
              }`}
            >
              <title>{loc.name}</title>
            </path>
          );
        })}
      </svg>

      {siteConfig.offices.map((office) => {
        const { x, y } = projectToMap(office.geo);
        const active = office.id === selectedId;
        return (
          <button
            key={office.id}
            type="button"
            onClick={() => onSelect(office.id)}
            aria-pressed={active}
            aria-label={`${office.name}, ${office.city}, ${office.state}`}
            style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span
                className={`absolute inline-flex h-full w-full rounded-full motion-safe:animate-ping ${active ? "bg-primary/60" : "bg-primary/35"}`}
                aria-hidden="true"
              />
              <span
                className={`relative inline-flex items-center justify-center rounded-full border-2 border-white shadow-md ring-primary transition-transform group-hover:scale-125 group-focus-visible:ring-2 ${
                  office.isPrimary ? "h-5 w-5 bg-accent" : "h-3.5 w-3.5 bg-primary"
                } ${active ? "scale-125" : ""}`}
              >
                {office.isPrimary && <span className="text-[8px] font-bold leading-none text-accent-foreground">HQ</span>}
              </span>
            </span>
            <span
              className={`pointer-events-none absolute left-1/2 top-full mt-0.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-semibold shadow-sm sm:block ${
                active ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground"
              }`}
            >
              {office.city.split(",")[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
