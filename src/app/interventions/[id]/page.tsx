import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Handshake,
  MapPin,
  Sparkles,
} from "lucide-react";

import { FieldGallery } from "@/components/interventions/field-gallery";
import { getInterventionGallery } from "@/data/intervention-media";
import { INTERVENTIONS_DATA } from "@/data/interventions-data";
import { OPERATIONAL_STATES } from "@/data/operational-states";

export const dynamicParams = false;

function getProject(id: string) {
  return INTERVENTIONS_DATA.find((project) => project.id === id);
}

export function generateStaticParams() {
  return INTERVENTIONS_DATA.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return {};
  return {
    title: `${project.shortTitle} | Project Dossier | Life Helpers Initiative`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.image.src, alt: project.image.alt }],
    },
  };
}

export default async function InterventionDossierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const gallery = getInterventionGallery(project);
  const states = OPERATIONAL_STATES.filter((s) => project.states.includes(s.id));
  const index = INTERVENTIONS_DATA.findIndex((p) => p.id === project.id);
  const next = INTERVENTIONS_DATA[(index + 1) % INTERVENTIONS_DATA.length];
  const related = INTERVENTIONS_DATA.filter(
    (p) => p.id !== project.id && p.primaryThematic === project.primaryThematic,
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    name: project.title,
    description: project.summary,
    funder: project.donor,
    areaServed: states.map((s) => `${s.name}, Nigeria`),
    parentOrganization: { "@type": "NGO", name: "Life Helpers Initiative", url: "https://lhinigeria.org" },
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <Link
          href="/interventions/projectandintervention"
          className="mb-6 inline-flex items-center gap-1 rounded text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All projects &amp; interventions
        </Link>

        {/* Header */}
        <header className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              — Project dossier
            </p>
            <h1 className="mt-3 font-serif-display text-3xl font-light leading-tight text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              {project.donor}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <a
              href={`/interventions/${project.id}/factsheet`}
              download={`LHI-factsheet-${project.id}.pdf`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              1-page factsheet (PDF)
            </a>
          </div>
        </header>

        {/* Facts strip */}
        <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Fact icon={Calendar} label="Status & duration" value={`${project.status} · ${project.duration}`} />
          <Fact icon={MapPin} label="Location" value={project.locations} />
          <Fact icon={Handshake} label="States" value={states.map((s) => s.name).join(", ")} />
        </dl>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <FieldGallery images={gallery} youtubeId={project.youtubeId} title={project.shortTitle} />

            <section aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="font-serif-display text-2xl font-light text-foreground">
                Case study overview
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{project.summary}</p>
            </section>

            <section aria-labelledby="deliverables-heading">
              <h2 id="deliverables-heading" className="font-serif-display text-2xl font-light text-foreground">
                Key interventions &amp; deliverables
              </h2>
              <ul className="mt-4 space-y-3">
                {project.keyInterventions.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                Headline impact
              </h2>
              <p className="mt-2 font-serif-display text-xl font-light leading-snug text-foreground sm:text-2xl">
                {project.impactMetric}
              </p>
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Thematic areas
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.thematicAreas.map((t) => (
                  <Link
                    key={t.id}
                    href={t.href}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${t.badgeColor}`}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                For donors &amp; consortium partners
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Need compliance documents, M&amp;E data or a partnership conversation about this project?
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/partner-portal"
                  className="inline-flex items-center justify-between rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Partner &amp; bidder portal <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
                <Link
                  href="/partner-portal#eoi"
                  className="inline-flex items-center justify-between rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Request consortium partnership <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Related interventions
                </h2>
                <ul className="mt-3 space-y-1">
                  {related.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/interventions/${p.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-muted"
                      >
                        <span className="line-clamp-1">{p.shortTitle}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-16 flex justify-end border-t border-border pt-8">
          <Link
            href={`/interventions/${next.id}`}
            className="group inline-flex items-center gap-3 text-right"
          >
            <span>
              <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">Next project</span>
              <span className="font-serif-display text-lg text-foreground group-hover:text-primary">
                {next.shortTitle}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function Fact({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <dt className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
