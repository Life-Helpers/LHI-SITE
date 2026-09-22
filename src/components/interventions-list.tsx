"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Filter,
  GraduationCap,
  Handshake,
  HeartPulse,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wheat,
  X,
} from "lucide-react";

import {
  INTERVENTIONS_DATA,
  THEMATIC_PILLARS,
  type ThematicPillarId,
} from "@/data/interventions-data";

interface InterventionsListProps {
  initialFilter?: ThematicPillarId | "all";
}

const THEMATIC_ICONS: Record<ThematicPillarId, React.ElementType> = {
  health: HeartPulse,
  education: GraduationCap,
  livelihood: Handshake,
  "food-security": Wheat,
  "social-inclusion": Users,
  protection: ShieldCheck,
};

export function InterventionsList({ initialFilter = "all" }: InterventionsListProps) {
  const [selectedPillar, setSelectedPillar] = useState<ThematicPillarId | "all">(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "Active" | "Completed" | "Multi-Year">("all");

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: INTERVENTIONS_DATA.length };
    (Object.keys(THEMATIC_PILLARS) as ThematicPillarId[]).forEach((pId) => {
      counts[pId] = INTERVENTIONS_DATA.filter((item) =>
        item.thematicAreas.some((t) => t.id === pId)
      ).length;
    });
    return counts;
  }, []);

  const filteredProjects = useMemo(() => {
    return INTERVENTIONS_DATA.filter((project) => {
      // Thematic area filter
      if (selectedPillar !== "all") {
        const matchesThematic = project.thematicAreas.some((t) => t.id === selectedPillar);
        if (!matchesThematic) return false;
      }

      // Status filter
      if (selectedStatus !== "all" && project.status !== selectedStatus) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText =
          project.title.toLowerCase().includes(query) ||
          project.shortTitle.toLowerCase().includes(query) ||
          project.donor.toLowerCase().includes(query) ||
          project.locations.toLowerCase().includes(query) ||
          project.summary.toLowerCase().includes(query) ||
          project.tags.some((t) => t.toLowerCase().includes(query)) ||
          project.keyInterventions.some((k) => k.toLowerCase().includes(query));

        if (!matchesText) return false;
      }

      return true;
    });
  }, [selectedPillar, selectedStatus, searchQuery]);

  return (
    <div className="space-y-10">
      {/* 6 Thematic Areas Quick Jump Cards */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Layers size={14} />
              <span>What We Do · 6 Thematic Pillars</span>
            </div>
            <h3 className="font-serif-display text-xl font-bold text-foreground sm:text-2xl">
              Projects Mapped to Our 6 Thematic Areas
            </h3>
          </div>
          <p className="max-w-md text-xs text-muted-foreground">
            Every intervention is deeply integrated into one or more of LHI&apos;s core operational sectors. Click any pillar to filter projects or visit its dedicated program page.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(Object.keys(THEMATIC_PILLARS) as ThematicPillarId[]).map((pillarKey) => {
            const pillar = THEMATIC_PILLARS[pillarKey];
            const Icon = THEMATIC_ICONS[pillarKey];
            const count = filterCounts[pillarKey] || 0;
            const isSelected = selectedPillar === pillarKey;

            return (
              <div
                key={pillarKey}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground group-hover:text-primary"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {count}
                    </span>
                  </div>

                  <h4 className="mt-3 text-xs font-bold text-foreground line-clamp-1">
                    {pillar.name}
                  </h4>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPillar(selectedPillar === pillarKey ? "all" : pillarKey)
                    }
                    className={`font-semibold transition-colors ${
                      isSelected ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {isSelected ? "Active Filter" : "Filter"}
                  </button>

                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-0.5 text-muted-foreground transition-colors hover:text-primary"
                    title={`Go to ${pillar.name} page in What We Do`}
                  >
                    <span>Page</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar & Status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, donor (e.g. MSH, Save the Children, UNICEF), state, or keyword..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Status:</span>
            <div className="flex rounded-xl border border-border bg-muted/30 p-1 text-xs">
              {(["all", "Active", "Multi-Year", "Completed"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    selectedStatus === status
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status === "all" ? "All" : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedPillar("all")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedPillar === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            <span>All Interventions</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                selectedPillar === "all"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {filterCounts.all}
            </span>
          </button>

          {(Object.keys(THEMATIC_PILLARS) as ThematicPillarId[]).map((pKey) => {
            const pillar = THEMATIC_PILLARS[pKey];
            const Icon = THEMATIC_ICONS[pKey];
            const isSelected = selectedPillar === pKey;
            const count = filterCounts[pKey] || 0;

            return (
              <button
                key={pKey}
                type="button"
                onClick={() => setSelectedPillar(pKey)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={13} />
                <span>{pillar.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {(selectedPillar !== "all" || searchQuery || selectedStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSelectedPillar("all");
                setSearchQuery("");
                setSelectedStatus("all");
              }}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline ml-2"
            >
              <X size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 text-xs text-muted-foreground">
        <div>
          Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of{" "}
          <span className="font-semibold text-foreground">{INTERVENTIONS_DATA.length}</span> projects &amp; interventions
          {selectedPillar !== "all" && (
            <> in thematic area <strong className="text-primary">{THEMATIC_PILLARS[selectedPillar].name}</strong></>
          )}
        </div>
        {selectedPillar !== "all" && (
          <Link
            href={THEMATIC_PILLARS[selectedPillar].href}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <span>Visit {THEMATIC_PILLARS[selectedPillar].name} Thematic Page</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {/* Projects Cards List */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Filter className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <h4 className="mt-3 text-sm font-bold text-foreground">No interventions found</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            No active or past interventions match your search query &ldquo;{searchQuery}&rdquo;. Try another term or reset your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedPillar("all");
              setSearchQuery("");
              setSelectedStatus("all");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {filteredProjects.map((project, idx) => {
            return (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                {/* Project Image & Visual Badges */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={idx < 2}
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute left-4 top-4 right-4 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-xs">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          project.status === "Active"
                            ? "bg-emerald-500 animate-pulse"
                            : project.status === "Multi-Year"
                            ? "bg-blue-500"
                            : "bg-muted-foreground"
                        }`}
                      />
                      {project.status} Project
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                      <Calendar size={12} />
                      {project.duration}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
                      <Building2 size={13} className="text-primary" />
                      <span className="line-clamp-1">{project.donor}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  {/* Linked Thematic Areas Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                      Thematic Areas:
                    </span>
                    {project.thematicAreas.map((thematic) => {
                      const Icon = THEMATIC_ICONS[thematic.id];
                      return (
                        <Link
                          key={thematic.id}
                          href={thematic.href}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-all hover:scale-105 ${thematic.badgeColor}`}
                          title={`Click to view ${thematic.name} in What We Do`}
                        >
                          <Icon size={11} />
                          <span>{thematic.name}</span>
                          <ChevronRight size={10} className="opacity-60" />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Title & Location */}
                  <h3 className="mt-3 font-serif-display text-lg font-bold text-foreground sm:text-xl group-hover:text-primary transition-colors">
                    <Link href={`/interventions/${project.id}`} className="hover:underline">
                      {project.title}
                    </Link>
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={13} className="text-primary shrink-0" />
                    <span>{project.locations}</span>
                  </div>

                  {/* Project Summary */}
                  <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>

                  {/* Key Interventions Checklist */}
                  <div className="mt-4 space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3.5 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Key Programmatic Deliverables:
                    </div>
                    <ul className="space-y-1 text-muted-foreground">
                      {project.keyInterventions.map((act, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact Metric Highlight */}
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary font-medium">
                    <Sparkles size={16} className="shrink-0 text-primary" />
                    <span className="text-[11px] leading-tight">
                      <strong>Impact:</strong> {project.impactMetric}
                    </span>
                  </div>

                  {/* Bottom Actions & Thematic Navigation Links */}
                  <div className="mt-auto pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">What We Do:</span>
                      {project.thematicAreas.map((t) => (
                        <Link
                          key={t.id}
                          href={t.href}
                          className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5 text-[11px]"
                        >
                          <span>{t.name}</span>
                          <ArrowRight size={10} />
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/interventions/${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
                    >
                      <span>View Project Dossier</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
