import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Quote, Target } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { CORE_STRATEGIES, STRATEGIC_PLAN as SP } from "@/data/organisation";

export const metadata: Metadata = {
  alternates: { canonical: "/our-strategies" },
  title: "Our Strategies & Strategic Plan 2026–2030",
  description:
    "LHI's four strategies (capacities, systems, partnership, networking) and the Strategic Plan 2026–2030: goal, expected results, key strategies, theory of change and strategic imperatives.",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">{children}</p>;
}

export default function OurStrategiesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— How We Work"
        title={
          <>
            Our Strategies &amp; <em className="font-light italic text-primary">Strategic Plan.</em>
          </>
        }
        subtitle={SP.subtitle}
        description={`LHI's third strategic plan (${SP.date}) builds on the achievements of 2022–2025 to consolidate programme impact, boost resource mobilisation, and expand collaboration and influence.`}
        image={africanFulfillmentImages.strategiesHero}
      />

      {/* Plan navigation */}
      <nav aria-label="On this page" className="sticky top-16 z-20 border-b border-border bg-background/90 backdrop-blur">
        <ul className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-6 lg:px-8">
          {[
            ["#strategies", "Four strategies"],
            ["#goal", "Goal & results"],
            ["#key-strategies", "Key strategies"],
            ["#theory-of-change", "Theory of change"],
            ["#units", "Strategic units"],
            ["#imperatives", "Imperatives"],
          ].map(([href, label]) => (
            <li key={href} className="shrink-0">
              <a href={href} className="hover:text-primary">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Four strategies */}
      <section id="strategies" className="scroll-mt-32 border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Our Strategies</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">Four ways we strengthen change</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {CORE_STRATEGIES.map((s, i) => (
              <article key={s.code} className="rounded-3xl border border-border bg-card p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-serif-display text-lg text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="font-mono text-xs font-bold text-primary">{s.code}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-foreground">Core focus areas</p>
                <ul className="mt-2 space-y-1.5">
                  {s.focus.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Foreword */}
      <section className="border-b border-border bg-muted/20 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {[SP.foreword, SP.acknowledgement].map((q) => (
            <figure key={q.author} className="rounded-3xl border border-border bg-card p-8">
              <Quote className="h-7 w-7 text-primary/40" />
              <blockquote className="mt-3 font-serif-display text-xl font-light leading-snug text-foreground">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-bold text-foreground">{q.author}</span>
                <span className="text-muted-foreground"> · {q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Goal & results */}
      <section id="goal" className="scroll-mt-32 border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Strategic Plan 2026–2030</Eyebrow>
          <div className="mt-4 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90">
              <Target className="h-4 w-4" /> Overall goal
            </p>
            <p className="mt-3 font-serif-display text-2xl font-light leading-snug sm:text-3xl">{SP.goal}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">A. Programme outcomes</h3>
              <p className="mt-1 text-sm text-muted-foreground">{SP.outcomeA}</p>
              <ul className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
                {SP.programmeResults.map((r) => (
                  <li key={r.area} className="grid grid-cols-3 gap-3 px-5 py-3.5 text-sm">
                    <span className="font-semibold text-foreground">{r.area}</span>
                    <span className="col-span-2 text-muted-foreground">{r.result}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">B. Organisational capacity</h3>
              <p className="mt-1 text-sm text-muted-foreground">{SP.outcomeB}</p>
              <ul className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
                {SP.capacityResults.map((r) => (
                  <li key={r.area} className="grid grid-cols-3 gap-3 px-5 py-3.5 text-sm">
                    <span className="font-semibold text-foreground">{r.area}</span>
                    <span className="col-span-2 text-muted-foreground">{r.result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key strategies */}
      <section id="key-strategies" className="scroll-mt-32 border-b border-border bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Operationalising the plan</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">Seven key strategies</h2>
          <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SP.keyStrategies.map((k, i) => (
              <li key={k.name} className="rounded-2xl border border-border bg-card p-6">
                <span className="font-serif-display text-3xl text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-bold text-foreground">{k.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{k.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Theory of change */}
      <section id="theory-of-change" className="scroll-mt-32 border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>LHI Theory of Change</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">How the results connect</h2>
          <a href={LHI_PHOTOS.theoryOfChange.src} target="_blank" rel="noreferrer" className="mt-8 block overflow-hidden rounded-3xl border border-border bg-card p-2">
            <Image
              src={LHI_PHOTOS.theoryOfChange.src}
              alt={LHI_PHOTOS.theoryOfChange.alt}
              width={1600}
              height={1200}
              sizes="(min-width: 1152px) 1100px, 100vw"
              className="h-auto w-full rounded-2xl"
            />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">Select the diagram to open it full size.</p>
        </div>
      </section>

      {/* Strategic units + org */}
      <section id="units" className="scroll-mt-32 border-b border-border bg-muted/20 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-3">
            <Eyebrow>Strategic units</Eyebrow>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">How LHI is organised</h2>
            <ul className="mt-8 space-y-3">
              {SP.strategicUnits.map((u) => (
                <li key={u.name} className="rounded-2xl border border-border bg-card p-5">
                  <p className="font-bold text-foreground">{u.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{u.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <Compass className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-bold text-foreground">Geographical focus</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{SP.geography}</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-bold text-foreground">Target groups</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{SP.targetGroups}</p>
            </div>
            <a href={LHI_PHOTOS.organogram.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-3xl border border-border bg-card p-2">
              <Image src={LHI_PHOTOS.organogram.src} alt={LHI_PHOTOS.organogram.alt} width={1600} height={1000} className="h-auto w-full rounded-2xl" />
              <span className="block px-3 py-2 text-xs text-muted-foreground">LHI organogram: select to enlarge</span>
            </a>
          </div>
        </div>
      </section>

      {/* Imperatives + achievements */}
      <section id="imperatives" className="scroll-mt-32 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Strategic imperatives 2026–2030</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-7">
              <h3 className="font-bold text-foreground">Programmatic</h3>
              <ul className="mt-4 space-y-2.5">
                {SP.imperatives.programmatic.map((t) => (
                  <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-7">
              <h3 className="font-bold text-foreground">Organisational capacity</h3>
              <ul className="mt-4 space-y-2.5">
                {SP.imperatives.organisational.map((t) => (
                  <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-7">
              <h3 className="font-bold text-foreground">Key achievements, 2022–2025</h3>
              <ul className="mt-4 space-y-2.5">
                {SP.institutionalAchievements.map((t) => (
                  <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[LHI_PHOTOS.strategyWorkshop2, LHI_PHOTOS.strategyWorkshop3, LHI_PHOTOS.teamStrategicPlan].map((ph) => (
              <div key={ph.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The strategy review and planning workshop, Goshen Development Centre, Sokoto, 23–27 February 2026.
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/interventions/projectandintervention" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              See our projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/partner-portal" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
