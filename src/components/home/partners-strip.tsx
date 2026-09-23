"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ShieldCheck,
  X,
  CheckCircle2,
  ArrowRight,
  Globe2,
  MapPin,
  Calendar,
} from "lucide-react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";
import { PARTNERS_DATA } from "@/data/partners-data";
import type { CmsPartner } from "@/lib/cms/types";

type PartnerItem = CmsPartner & { logo: React.ReactNode; categoryBadgeColor: string };

const BUILT_IN = new Map(PARTNERS_DATA.map((p) => [p.id, p]));

const CATEGORY_BADGES: Record<CmsPartner["category"], string> = {
  "UN Agencies": "bg-primary/10 text-primary border-primary/20",
  "Bilateral Donors": "bg-accent/10 text-accent border-accent/25",
  "International NGOs": "bg-foreground/5 text-foreground border-foreground/15",
  "Government & Clusters": "bg-foreground/5 text-foreground border-foreground/15",
};

/** Uploaded logo from the CMS first, then the built-in mark, then the acronym. */
function toDisplay(partner: CmsPartner): PartnerItem {
  const builtIn = BUILT_IN.get(partner.id);
  const logo = partner.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={partner.logoUrl} alt="" className="max-h-full max-w-full object-contain" />
  ) : (
    builtIn?.logo ?? <span className="text-sm font-bold tracking-wide text-foreground">{partner.acronym}</span>
  );
  return {
    ...partner,
    logo,
    categoryBadgeColor: builtIn?.categoryBadgeColor ?? CATEGORY_BADGES[partner.category] ?? CATEGORY_BADGES["International NGOs"],
  };
}

export function PartnersStrip({ partners: rawPartners }: { partners: CmsPartner[] }) {
  const { t } = useLocale();
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null);
  const partners = React.useMemo(() => rawPartners.map(toDisplay), [rawPartners]);

  // Split all partners into two balanced tracks for the continuous dual-row marquee
  const halfLength = Math.ceil(partners.length / 2);
  const rowOnePartners = partners.slice(0, halfLength);
  const rowTwoPartners = partners.slice(halfLength);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPartner) {
        setSelectedPartner(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPartner]);

  return (
    <section
      id="implementing-partners-section"
      aria-labelledby="partners-heading"
      className="relative py-16 sm:py-24 overflow-hidden border-t border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-3xl -z-10"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center flex flex-col items-center max-w-3xl mx-auto">
          <h2
            id="partners-heading"
            className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-light text-foreground"
          >
            {t.home.partners.heading || "Implementing Partners"}
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {t.home.partners.subtitle ||
              "Delivering life-saving emergency relief, child protection, and community resilience in direct operational partnership with leading multilateral donors, UN agencies, and global organizations."}
          </p>
        </ScrollReveal>
      </div>

      {/* Continuous Smooth Dual-Track Logo Marquee with Edge Fade Masks */}
      <div className="mt-8 relative w-full overflow-hidden py-3">
        {/* Edge Blur & Vignette Gradients */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 md:w-40 bg-gradient-to-r from-background via-background/90 to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 md:w-40 bg-gradient-to-l from-background via-background/90 to-transparent z-10"
        />

        {/* Track 1: Moving Forward (Reduced speed for relaxed, readable gliding) */}
        <div className="relative w-full overflow-hidden mb-4 sm:mb-6">
          <div className="flex w-max gap-4 sm:gap-6 animate-[marquee_85s_linear_infinite] hover:[animation-play-state:paused]">
            {/* Duplicate track for seamless infinite loop */}
            {[...rowOnePartners, ...rowOnePartners, ...rowOnePartners].map((partner, idx) => (
              <PartnerCard
                key={`track1-${partner.id}-${idx}`}
                partner={partner}
                onSelect={setSelectedPartner}
              />
            ))}
          </div>
        </div>

        {/* Track 2: Moving Reverse / Offset (Reduced speed for relaxed, readable gliding) */}
        {rowTwoPartners.length > 0 && (
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max gap-4 sm:gap-6 animate-[marquee-reverse_85s_linear_infinite] hover:[animation-play-state:paused]">
              {/* Duplicate track for seamless infinite loop */}
              {[...rowTwoPartners, ...rowTwoPartners, ...rowTwoPartners].map((partner, idx) => (
                <PartnerCard
                  key={`track2-${partner.id}-${idx}`}
                  partner={partner}
                  onSelect={setSelectedPartner}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Partner Detail Modal / Dossier */}
      {selectedPartner && (
        <PartnerDetailModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      )}
    </section>
  );
}

/**
 * Clean Logo-Only Brand Card matching Brands Carousel 4 template aesthetic
 */
interface PartnerCardProps {
  partner: PartnerItem;
  onSelect: (partner: PartnerItem) => void;
  isGrid?: boolean;
}

function PartnerCard({ partner, onSelect, isGrid = false }: PartnerCardProps) {
  return (
    <div
      id={`partner-card-${partner.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(partner)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(partner);
        }
      }}
      aria-label={partner.name}
      title={partner.name}
      className={`group relative flex items-center justify-center cursor-pointer rounded-2xl border border-border/80 bg-card/90 dark:bg-slate-900/80 backdrop-blur-md px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg ${
        isGrid
          ? "w-full h-24 sm:h-28"
          : "w-[200px] sm:w-[240px] h-24 sm:h-28 shrink-0"
      }`}
    >
      {/* Pristine centered brand logo mark */}
      <div className="w-full h-full flex items-center justify-center max-w-[170px] max-h-[56px] transition-transform duration-300 group-hover:scale-105">
        {partner.logo}
      </div>
    </div>
  );
}

/**
 * Partner Detail Dossier Modal
 */
interface PartnerDetailModalProps {
  partner: PartnerItem;
  onClose: () => void;
}

function PartnerDetailModal({ partner, onClose }: PartnerDetailModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-blur-in"
      onClick={onClose}
    >
      <div
        id="partner-dossier-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="partner-modal-close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close partner dossier"
          className="absolute top-5 right-5 p-2 rounded-full border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-border/60 pb-6 pr-8">
          <div className="h-16 w-36 flex items-center justify-center rounded-2xl border border-border/70 bg-background/90 p-2 shadow-xs shrink-0">
            {partner.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${partner.categoryBadgeColor}`}
              >
                {partner.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Partner since {partner.partnershipSince}
              </span>
            </div>
            <h3
              id="partner-modal-title"
              className="font-serif-display text-xl sm:text-2xl font-medium tracking-tight text-foreground"
            >
              {partner.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Globe2 className="w-3.5 h-3.5 text-primary" />
              <span>{partner.countryOrOrigin} · Founded {partner.establishedYear}</span>
            </p>
          </div>
        </div>

        {/* Impact Highlight Banner (only when a verified figure is set in the CMS) */}
        {partner.statsValue && (
        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {partner.statsHeadline}
            </span>
            <p className="font-serif-display text-2xl font-medium text-foreground">
              {partner.statsValue}
            </p>
          </div>
          <ShieldCheck className="w-8 h-8 text-primary/70 shrink-0" />
        </div>
        )}

        {/* Description & Humanitarian Mandate */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Partnership Scope & Mandate
          </h4>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {partner.description}
          </p>
        </div>

        {/* Joint Programs with LHI */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Joint Programs & Interventions
          </h4>
          <ul className="space-y-2">
            {partner.jointPrograms.map((program, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>{program}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Target States */}
        <div className="mt-5 pt-4 border-t border-border/60">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Target Nigerian States</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {partner.targetStates.map((state) => (
              <span
                key={state}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border/50"
              >
                {state}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            <span>Visit Official Partner Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/interventions/projectandintervention"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <span>View Related Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
