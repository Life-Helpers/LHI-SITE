"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  MapPin,
  Sparkles,
  Wheat,
} from "lucide-react";

import { TRANSFORMATION_ITEMS, type TransformationItem } from "@/data/transformations-data";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "food-security": Wheat,
  health: HeartPulse,
  education: GraduationCap,
};

export function BeforeAfterGallery({
  initialId = "farmland-irrigation",
  showHeading = true,
}: {
  initialId?: string;
  showHeading?: boolean;
}) {
  const [selectedId, setSelectedId] = useState(initialId);

  const activeItem: TransformationItem =
    TRANSFORMATION_ITEMS.find((t) => t.id === selectedId) || TRANSFORMATION_ITEMS[0];

  const CategoryIcon = CATEGORY_ICONS[activeItem.category] || Sparkles;

  return (
    <div className="space-y-8">
      {/* Header (optional) */}
      {showHeading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles size={14} />
            <span>Interactive Visual Evidence · Before &amp; After</span>
          </div>
          <h2 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl lg:text-4xl">
            Community Transformations <em className="font-light italic text-primary">in Focus</em>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            Slide horizontally to see the tangible on-the-ground impact of LHI&apos;s multi-sectoral interventions across frontline Nigerian states.
          </p>
        </div>
      )}

      {/* Transformation Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-4">
        {TRANSFORMATION_ITEMS.map((item) => {
          const isSelected = item.id === selectedId;
          const TabIcon = CATEGORY_ICONS[item.category] || Sparkles;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              <TabIcon size={14} className={isSelected ? "text-primary-foreground" : "text-primary"} />
              <span className="line-clamp-1">{item.title.split(" vs.")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left: The Interactive Slider Component (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-3 sm:p-5 shadow-sm">
            <BeforeAfterSlider
              key={activeItem.id}
              beforeImage={activeItem.before.image}
              beforeAlt={activeItem.before.alt}
              beforeLabel="BEFORE"
              beforeTag={activeItem.before.tag}
              afterImage={activeItem.after.image}
              afterAlt={activeItem.after.alt}
              afterLabel="AFTER"
              afterTag={activeItem.after.tag}
              aspectRatio="16/10"
              initialPosition={50}
            />

            {/* Split Details Banner */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/60 text-xs">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  {activeItem.before.label}
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {activeItem.before.description}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  {activeItem.after.label}
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {activeItem.after.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Programmatic Details & Metrics (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div>
            {/* Thematic Area Badge & Location */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={activeItem.thematicHref}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <CategoryIcon size={12} />
                <span>{activeItem.categoryLabel}</span>
                <ChevronRight size={12} />
              </Link>

              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {activeItem.year}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-4 font-serif-display text-xl font-bold text-foreground sm:text-2xl">
              {activeItem.title}
            </h3>

            {/* Location & Partner */}
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-primary shrink-0" />
                <span>{activeItem.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 size={13} className="text-primary shrink-0" />
                <span>Supported by: <strong>{activeItem.donorPartner}</strong></span>
              </div>
            </div>

            {/* Narrative Summary */}
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {activeItem.summary}
            </p>

            {/* 4 Impact Metrics Grid */}
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {activeItem.impactMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-muted/30 p-3 text-center"
                >
                  <div className="text-lg font-bold text-primary sm:text-xl">
                    {metric.value}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Deliverables / Transformations */}
            <div className="mt-6 space-y-2 border-t border-border pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Programmatic Enhancements Delivered:
              </span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {activeItem.keyChanges.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Action Links */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <Link
              href={activeItem.thematicHref}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <span>Explore {activeItem.categoryLabel} Pillar</span>
              <ArrowRight size={12} />
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
            >
              <span>Sponsor a Community</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
