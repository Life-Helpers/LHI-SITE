"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  ArrowRight,
  Sparkles,
  HeartPulse,
  GraduationCap,
  Handshake,
  Wheat,
  Users,
  ShieldCheck,
} from "lucide-react";

import { LHI_PHOTOS } from "@/data/lhi-photos";
import { THEMATIC_AREAS, type ThematicAreaId } from "@/data/thematic-areas";
import { useLocale } from "@/i18n/locale-context";

interface StrategicPillar {
  id: string;
  pillarNumber: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: typeof HeartPulse;
  tag: string;
  accentColor: string;
  image: string;
}

type PillarId = ThematicAreaId;

/** Id, number, name and link come from the shared thematic area registry. */
const areaTile = (id: ThematicAreaId) => ({ id, pillarNumber: THEMATIC_AREAS[id].number, title: THEMATIC_AREAS[id].name, href: THEMATIC_AREAS[id].href });

/** Thematic areas and scope from LHI's Organisational Profile; photos are LHI's own. */
const strategicPillars: (StrategicPillar & { id: PillarId })[] = [
  // 3 UP (Top Row)
  {
    ...areaTile("health"),
    subtitle: "MNCH, Nutrition, WASH & Malaria",
    description:
      "Maternal, newborn and child health, nutrition, WASH, immunisation, malaria, sexual and reproductive health, HIV/AIDS and TB.",
    icon: HeartPulse,
    tag: "Health & Nutrition",
    accentColor: "from-primary/15 to-accent/10",
    image: LHI_PHOTOS.healthScreening.src,
  },
  {
    ...areaTile("education"),
    subtitle: "Formal & Non-Formal Learning",
    description:
      "Early child development, formal and non-formal education, accelerated learning for out-of-school children, and education governance.",
    icon: GraduationCap,
    tag: "Basic Education",
    accentColor: "from-primary/15 to-accent/10",
    image: LHI_PHOTOS.abepGirls.src,
  },
  {
    ...areaTile("livelihood"),
    subtitle: "Skills, Savings & Enterprise",
    description:
      "Technical and vocational training, village savings and loan associations, entrepreneurship, financial literacy and multi-purpose cash assistance.",
    icon: Handshake,
    tag: "Resilience & Skills",
    accentColor: "from-primary/15 to-accent/10",
    image: LHI_PHOTOS.gidanArzikiTailoring.src,
  },
  // 3 DOWN (Bottom Row)
  {
    ...areaTile("food-security"),
    subtitle: "Agriculture & Climate Adaptation",
    description:
      "Smallholder agriculture, small ruminants and aquaculture, food supplies and climate adaptation, including farmers service hubs.",
    icon: Wheat,
    tag: "Food Systems",
    accentColor: "from-primary/15 to-accent/10",
    image: LHI_PHOTOS.farmerWomanHarvest.src,
  },
  {
    ...areaTile("social-inclusion"),
    subtitle: "Governance & Peacebuilding",
    description: "Governance, peacebuilding and high-level advocacy so that marginalised people have a voice in decisions that affect them.",
    icon: Users,
    tag: "Voice & Participation",
    accentColor: "from-primary/15 to-accent/10",
    image: LHI_PHOTOS.communityDialogue.src,
  },
  {
    ...areaTile("protection"),
    subtitle: "Women, Girls & Children",
    description: "Preventing and responding to violence against women and girls, child protection, and safeguarding in every programme.",
    icon: ShieldCheck,
    tag: "Safe Spaces",
    accentColor: "from-primary/15 to-accent/10",
    image: LHI_PHOTOS.activismWomen.src,
  },
];

export function WhatWeDoTiles({ projectCounts }: { projectCounts: Partial<Record<string, number>> }) {
  const { t } = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        id="what-we-do"
        aria-labelledby="what-we-do-heading"
        className="relative overflow-hidden border-t border-border/70 bg-muted/20 py-20 sm:py-28"
      >
        {/* Background ambient decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl rounded-full bg-primary/5 blur-3xl"
        />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border/60">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Our Thematic Areas</span>
              </div>
              <h2
                id="what-we-do-heading"
                className="mt-3 font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light text-foreground"
              >
                What We Do — <span className="italic text-primary font-serif">Community Impact</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {t.home.whatWeDo.subtitle ||
                  "Integrated humanitarian and development programmes across 11 states in Nigeria."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-xs"
              >
                <span>{t.home.whatWeDo.viewAllPrograms || "All 9 Interventions"}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Thematic area cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {strategicPillars.map((pillar, index) => (
              <JellyCard
                count={projectCounts[pillar.id] ?? 0}
                key={pillar.id}
                pillar={pillar}
                index={index}
                isHovered={hoveredCardId === pillar.id}
                onHover={() => setHoveredCardId(pillar.id)}
                onLeave={() => setHoveredCardId(null)}
                reducedMotion={!!shouldReduceMotion}
              />
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

function JellyCard({
  pillar,
  index,
  isHovered,
  onHover,
  onLeave,
  reducedMotion,
  count,
}: {
  pillar: StrategicPillar;
  count: number;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  reducedMotion: boolean;
}) {
  const Icon = pillar.icon;

  // Spring physics jelly animation configuration
  const springTransition = {
    type: "spring" as const,
    stiffness: 380,
    damping: 12,
    mass: 0.8,
  };

  const jellyVariants = {
    rest: {
      scale: 1,
      y: 0,
      rotate: 0,
      borderRadius: "24px",
      transition: springTransition,
    },
    hover: reducedMotion
      ? { y: -4 }
      : {
          scale: 1.035,
          y: -8,
          rotate: index % 2 === 0 ? [-0.8, 1.2, -0.6, 0] : [0.8, -1.2, 0.6, 0],
          borderRadius: [
            "24px",
            "30px 18px 28px 20px",
            "20px 28px 18px 30px",
            "24px",
          ],
          transition: {
            ...springTransition,
            rotate: { duration: 0.5, ease: "easeInOut" },
            borderRadius: { duration: 0.7, ease: "easeInOut" },
          },
        },
    tap: {
      scale: 0.95,
      y: 2,
      rotate: 0,
      transition: { type: "spring" as const, stiffness: 500, damping: 18 },
    },
  };

  return (
    <m.div
      variants={jellyVariants}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      whileTap="tap"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex flex-col justify-between overflow-hidden border border-border/80 bg-card p-6 shadow-xs cursor-pointer transition-colors duration-300 hover:border-primary/60 hover:shadow-xl dark:bg-[#070e1c]"
    >
      {/* Dynamic Specular Jelly Sheen Overlay */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pillar.accentColor} opacity-20 transition-opacity duration-300 group-hover:opacity-60`}
      />

      {/* Gloss reflection sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 dark:bg-white/5 blur-2xl transition-transform duration-500 group-hover:scale-150"
      />

      <div>
        {/* Card Header: thematic area number & tag */}
        <div className="relative z-10 flex items-center">
          <span className="text-[11px] font-medium text-muted-foreground">
            {pillar.tag}
          </span>
        </div>

        {/* Icon & Title */}
        <div className="relative z-10 mt-6 flex items-start gap-4">
          <m.div
            animate={
              isHovered && !reducedMotion
                ? {
                    scale: [1, 1.15, 0.95, 1.08, 1],
                    rotate: [0, -6, 6, -2, 0],
                  }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30"
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </m.div>

          <div className="min-w-0">
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {pillar.title}
            </h3>
            <p className="text-xs font-semibold text-primary/80 dark:text-accent/90">
              {pillar.subtitle}
            </p>
          </div>
        </div>

        {/* Thumbnail peek */}
        <div className="relative mt-4 h-24 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={pillar.image}
            alt={pillar.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-108 brightness-95 dark:brightness-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
            <span className="font-bold text-foreground drop-shadow-sm">
              {count}
            </span>
            <span className="text-[10px] text-muted-foreground drop-shadow-sm">
              {count === 1 ? "profiled project" : "profiled projects"}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="relative z-10 mt-4 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {pillar.description}
        </p>
      </div>

      {/* Card Action Link */}
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-border/70 pt-4">
        <Link
          href={pillar.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline"
        >
          <span>Explore Thematic Area</span>
          <m.span
            animate={isHovered ? { x: 4 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </m.span>
        </Link>
        <span className="text-[10px] text-muted-foreground">Learn more</span>
      </div>
    </m.div>
  );
}
