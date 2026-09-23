import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Lock, MapPin, Music, Users } from "lucide-react";

import { siteConfig } from "@/config/site";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { FaqAccordion } from "@/components/faq-accordion";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import {
  ANTHEM,
  CORE_STRATEGIES,
  CORE_VALUES,
  MISSION,
  MOTTO,
  ORG_SUMMARY,
  PARTNER_NAMES,
  PHILOSOPHY,
  THEMATIC_FOCUS,
  VISION,
} from "@/data/organisation";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Life Helpers Initiative (LHI): a Nigerian NGO founded in 2004, working in development and humanitarian action across 11 states with 350+ staff and 700+ community volunteers.",
};

const VALUE_ICONS = { Love: Heart, Honesty: Lock, Inclusion: Users } as const;

const STATS = [
  { value: siteConfig.stats.projects, label: "Projects implemented" },
  { value: siteConfig.stats.peopleReached, label: "People directly reached" },
  { value: siteConfig.stats.households, label: "Households" },
  { value: siteConfig.stats.staff, label: "Staff members" },
  { value: siteConfig.stats.volunteers, label: "Community volunteers" },
  { value: "11", label: "States with offices" },
];

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Who We Are"
        title={
          <>
            About Life Helpers <em className="font-light italic text-primary">Initiative.</em>
          </>
        }
        subtitle={`“${MOTTO}”: ${PHILOSOPHY.toLowerCase()}`}
        description={ORG_SUMMARY}
        image={africanFulfillmentImages.aboutHero}
      />

      {/* Key numbers */}
      <section className="border-b border-border bg-card/40 py-10">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="font-serif-display text-3xl text-foreground">{s.value}</dd>
              <dt className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Vision, Mission, Philosophy, Motto */}
      <section className="border-b border-border py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Vision</span>
            <p className="mt-3 font-serif-display text-3xl font-light text-foreground">&ldquo;{VISION}&rdquo;</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Our Mission</span>
            <p className="mt-3 font-serif-display text-2xl font-light text-foreground">&ldquo;{MISSION}&rdquo;</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Our Philosophy</span>
            <p className="mt-3 font-serif-display text-2xl font-light text-foreground">{PHILOSOPHY}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Our Motto</span>
            <p className="mt-3 font-serif-display text-2xl font-light text-foreground">{MOTTO}</p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Coined from our acronym, LHI</p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">Our Core Values</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {CORE_VALUES.map((v) => {
              const Icon = VALUE_ICONS[v.name];
              return (
                <div key={v.name} className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">{v.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Origin */}
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Origin & Growth</p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">From the Beulah Project to 11 states</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Life Helpers was established on October 1, 2004, as the Beulah Project, supporting children at the orphanage. It was
              renamed Life Helpers Initiative in 2006 as it expanded its scope, and registered with the Corporate Affairs
              Commission, Abuja, by September 2007 ({siteConfig.cacRegistration.replace(" (September 2007)", "")}).
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              In the last two decades, LHI has implemented over 45 projects across Nigeria, directly reaching over 1.5 million
              people in more than 400,000 households, with qualified staff, robust internal systems and a digitally-driven
              infrastructure that deliver value for money and donor satisfaction.
            </p>
            <Link href="/our-history" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Read our full history <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image src={LHI_PHOTOS.hqOffice.src} alt={LHI_PHOTOS.hqOffice.alt} fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Thematic focus */}
      <section className="border-b border-border bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Thematic Focus</p>
          <h2 className="mt-2 max-w-2xl font-serif-display text-3xl font-light text-foreground">
            Six integrated thematic areas addressing the multidimensional needs of vulnerable populations
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMATIC_FOCUS.map((t) => (
              <Link key={t.id} href={t.href} className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.scope}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies */}
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">How we work</p>
              <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">Our four strategies</h2>
            </div>
            <Link href="/our-strategies" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Strategies & Strategic Plan 2026–2030 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CORE_STRATEGIES.map((s) => (
              <div key={s.code} className="rounded-2xl border border-border bg-card p-6">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">{s.code}</span>
                <h3 className="mt-3 font-bold text-foreground">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="border-b border-border bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Our offices</p>
          <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">Headquarters in Sokoto, offices in 10 more states</h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.offices.map((o) => (
              <li key={o.id} className="rounded-2xl border border-border bg-card p-5">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  <MapPin size={12} /> {o.state}
                  {o.isPrimary && " · HQ"}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                  {o.address}, {o.city}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners + Anthem */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Wall of Fame</p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">Our partners</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Over two decades of impact, LHI has been privileged to work alongside a distinguished community of global and
              national partners whose trust and collaboration have made our work possible.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PARTNER_NAMES.map((name) => (
                <li key={name} className="rounded-xl border border-border bg-card px-3 py-3 text-center text-xs font-semibold text-foreground">
                  {name}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/board-of-trustees" className="rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted">
                Board of Trustees
              </Link>
              <Link href="/management-team" className="rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted">
                Management Team
              </Link>
              <Link href="/our-commitment" className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
                Our Commitments & PSEA
              </Link>
            </div>
          </div>
          <aside className="rounded-3xl border border-primary/20 bg-primary/5 p-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              <Music className="h-4 w-4" /> Our Anthem
            </p>
            <div className="mt-4 space-y-1 font-serif-display text-lg italic leading-snug text-foreground">
              {ANTHEM.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16 sm:py-24">
        <FaqAccordion />
      </section>
    </main>
  );
}
