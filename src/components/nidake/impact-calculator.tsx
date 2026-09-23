"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, GraduationCap, Heart, Package } from "lucide-react";

import { SPONSOR_PACKS, donateHrefForKits } from "@/data/nidake";

interface KitEconomics {
  costUsd: number;
  yearsOfDignity: number;
  schoolDaysSaved: number;
}

const fmt = new Intl.NumberFormat("en-US");

export function NidakeImpactCalculator({ kit: NIDAKE_KIT }: { kit: KitEconomics }) {
  const [kits, setKits] = useState(10);
  const inputId = useId();

  const safeKits = Math.min(Math.max(Math.round(kits) || 1, 1), 5000);
  const schoolDays = safeKits * NIDAKE_KIT.schoolDaysSaved;
  const dignityYears = safeKits * NIDAKE_KIT.yearsOfDignity;
  const cost = safeKits * NIDAKE_KIT.costUsd;

  return (
    <section aria-labelledby="calculator-heading" className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Impact calculator</p>
          <h2 id="calculator-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            How many school days will you save?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            One NIDAKE reusable pad kit = {NIDAKE_KIT.yearsOfDignity} years of menstrual dignity and about{" "}
            {NIDAKE_KIT.schoolDaysSaved} school days a girl no longer misses.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-10">
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            Number of dignity kits to sponsor
          </label>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              type="range"
              min={1}
              max={500}
              value={Math.min(safeKits, 500)}
              onChange={(e) => setKits(Number(e.target.value))}
              aria-label="Kits slider"
              className="w-full accent-primary"
            />
            <input
              id={inputId}
              type="number"
              min={1}
              max={5000}
              value={kits}
              onChange={(e) => setKits(Number(e.target.value))}
              className="h-11 w-28 rounded-md border border-input bg-background px-3 text-center text-lg font-semibold text-foreground"
            />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-live="polite">
            <Result icon={Package} label="Dignity kits" value={fmt.format(safeKits)} />
            <Result icon={CalendarCheck} label="School days saved" value={fmt.format(schoolDays)} />
            <Result icon={Heart} label="Years of dignity" value={fmt.format(dignityYears)} />
            <Result icon={GraduationCap} label="Your gift (USD)" value={`$${fmt.format(cost)}`} />
          </dl>

          <div className="mt-8 flex justify-center">
            <Link
              href={donateHrefForKits(safeKits, NIDAKE_KIT.costUsd)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              Sponsor {fmt.format(safeKits)} {safeKits === 1 ? "kit" : "kits"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <h3 className="mt-16 text-center font-serif-display text-2xl font-light text-foreground">
          Sponsor-A-Girl direct packs
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          One click, fully targeted: every pack goes to displaced and rural schoolgirls.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPONSOR_PACKS.map((pack) => (
            <div key={pack.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">{pack.name}</p>
              <p className="mt-2 font-serif-display text-3xl text-foreground">
                ${fmt.format(pack.kits * NIDAKE_KIT.costUsd)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{pack.audience}</p>
              <ul className="mt-4 space-y-1 text-xs text-foreground">
                <li>{fmt.format(pack.kits)} {pack.kits === 1 ? "kit" : "kits"}</li>
                <li>{fmt.format(pack.kits * NIDAKE_KIT.schoolDaysSaved)} school days saved</li>
              </ul>
              <div className="mt-auto pt-5">
                <Link
                  href={donateHrefForKits(pack.kits, NIDAKE_KIT.costUsd)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Give this pack <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Result({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-muted/40 p-4 text-center">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <dt className="order-last mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-2 font-serif-display text-2xl text-foreground sm:text-3xl">{value}</dd>
    </div>
  );
}
