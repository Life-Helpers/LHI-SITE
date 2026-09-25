"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Handshake, Layers, MapPin, Users, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  getDonorsForState,
  getInterventionsForState,
  type MapProject,
  type OperationalState,
  type OperationalStateId,
} from "@/data/operational-states";
import { NIGERIA_VIEWBOX, useNigeriaLocations } from "@/lib/nigeria-map";


const numberFormat = new Intl.NumberFormat("en-NG");

export function OperationalMap({
  states,
  interventions: allInterventions,
  className = "",
  glass = false,
}: {
  states: OperationalState[];
  interventions: MapProject[];
  className?: string;
  /** Frosted-glass cards, for use over a photo background. */
  glass?: boolean;
}) {
  const surface = glass
    ? "border-white/60 bg-white/85 shadow-xl backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-black/70"
    : "border-border bg-card";
  const locations = useNigeriaLocations();
  const STATE_BY_ID = useMemo(() => new Map(states.map((s) => [s.id as string, s])), [states]);
  const [selectedId, setSelectedId] = useState<OperationalStateId | null>("sokoto");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selected = selectedId ? STATE_BY_ID.get(selectedId) : undefined;
  const interventions = useMemo(
    () => (selectedId ? getInterventionsForState(allInterventions, selectedId) : []),
    [allInterventions, selectedId],
  );
  const donors = useMemo(
    () => (selectedId ? getDonorsForState(allInterventions, selectedId) : []),
    [allInterventions, selectedId],
  );

  const select = (id: string) => {
    if (STATE_BY_ID.has(id)) setSelectedId(id as OperationalStateId);
  };

  return (
    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-12 ${className}`}>
      {/* Map */}
      <div className={`relative rounded-3xl border p-4 sm:p-6 lg:col-span-7 ${surface}`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            {states.length} office states
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden="true" /> LHI office state
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/25" aria-hidden="true" /> Other states
            </span>
          </div>
        </div>

        <svg
          viewBox={NIGERIA_VIEWBOX}
          role="group"
          aria-label="Map of Nigeria showing the states where Life Helpers Initiative has offices"
          className="h-auto w-full"
        >
          {locations.map((loc) => {
            const state = STATE_BY_ID.get(loc.id);
            const isActive = Boolean(state);
            const isSelected = loc.id === selectedId;
            const isHovered = loc.id === hoveredId;

            let fill = "fill-muted-foreground/15";
            if (isActive) fill = isSelected ? "fill-accent" : isHovered ? "fill-primary/80" : "fill-primary";

            return (
              <path
                key={loc.id}
                d={loc.path}
                className={`${fill} stroke-background transition-colors duration-200 ${
                  isActive ? "cursor-pointer focus:outline-none focus-visible:fill-accent" : ""
                }`}
                strokeWidth={isSelected ? 2.5 : 1}
                role={isActive ? "button" : undefined}
                tabIndex={isActive ? 0 : undefined}
                aria-label={isActive ? `${state!.name}: view LHI interventions` : undefined}
                aria-pressed={isActive ? isSelected : undefined}
                onClick={() => select(loc.id)}
                onKeyDown={(e) => {
                  if (isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    select(loc.id);
                  }
                }}
                onMouseEnter={() => isActive && setHoveredId(loc.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <title>{isActive ? `${state!.name}: LHI operational state` : loc.name}</title>
              </path>
            );
          })}
        </svg>
        <p className="mt-1 text-right text-[9px] text-muted-foreground">
          Map data:{" "}
          <a href="https://github.com/VictorCazanave/svg-maps" className="underline" rel="noopener noreferrer" target="_blank">
            svg-maps
          </a>{" "}
          (CC BY 4.0)
        </p>

        {/* State chips (mobile-friendly, keyboard-friendly alternative to the map) */}
        <div className="mt-4 flex flex-wrap gap-2">
          {states.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              aria-pressed={s.id === selectedId}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                s.id === selectedId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Office states</dt>
            <dd className="font-serif-display text-2xl text-foreground">{states.length}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Projects</dt>
            <dd className="font-serif-display text-2xl text-foreground">{siteConfig.stats.projects}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">People reached</dt>
            <dd className="font-serif-display text-2xl text-foreground">{siteConfig.stats.peopleReached}</dd>
          </div>
        </dl>
      </div>

      {/* State detail popover panel */}
      <div className="lg:col-span-5" aria-live="polite">
        {selected ? (
          <div className={`flex h-full flex-col rounded-3xl border p-6 shadow-sm ${surface}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                  {selected.zone}
                </p>
                <h3 className="mt-1 font-serif-display text-3xl font-light text-foreground">
                  {selected.name}
                  {selected.id !== "fct" && " State"}
                </h3>
                {selected.office && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    LHI office: {selected.office}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close state details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selected.focus}</p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat icon={Layers} label="Projects" value={String(interventions.length)} />
              <Stat
                icon={MapPin}
                label={selected.lgasCovered > 0 ? "LGAs covered" : "LGAs in state"}
                value={selected.lgasCovered > 0 ? `${selected.lgasCovered}/${selected.totalLgas}` : String(selected.totalLgas)}
              />
              <Stat
                icon={Users}
                label={selected.beneficiaries > 0 ? "Reached" : "Donor partners"}
                value={selected.beneficiaries > 0 ? numberFormat.format(selected.beneficiaries) : String(donors.length)}
              />
            </div>

            <h4 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
              Active interventions
            </h4>
            <ul className="mt-2 max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {interventions.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/interventions/${project.id}`}
                    className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-muted"
                  >
                    <span className="line-clamp-1">{project.shortTitle}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
              <Handshake className="h-3.5 w-3.5" aria-hidden="true" /> Donor partners on the ground
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {donors.map((donor) => (
                <span
                  key={donor}
                  className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {donor}
                </span>
              ))}
            </div>

            <p className="mt-auto pt-5 text-[10px] leading-relaxed text-muted-foreground">
              Projects listed are drawn from LHI&apos;s Organisational Profile. State reach figures appear once validated by the LHI M&amp;E unit.
            </p>
          </div>
        ) : (
          <div className={`flex h-full min-h-64 items-center justify-center rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground ${glass ? surface : "border-border"}`}>
            Select a highlighted state on the map to see LHI&apos;s interventions, donor partners and reach there.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-3">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <p className="mt-1.5 font-serif-display text-lg leading-none text-foreground">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
