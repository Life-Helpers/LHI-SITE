import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FolderGit2,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Program } from "@/types/content";
import type { ThematicPillarId } from "@/data/interventions-data";
import { getInterventions } from "@/lib/cms/content";

export async function ProgramDetail({ program }: { program: Program }) {
  const allProjects = await getInterventions();
  // Find all projects linked to this thematic pillar
  const pillarId = program.id as ThematicPillarId;
  const linkedProjects = allProjects.filter((proj) =>
    proj.thematicAreas.some((t) => t.id === pillarId)
  );

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link
          href="/programs"
          className="mb-6 inline-flex items-center gap-1 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All programs
        </Link>

        {/* Thematic African Fulfillment Image Banner */}
        {program.image && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[21/9]">
              <Image
                src={program.image}
                alt={program.imageAlt || `${program.name} program showing smiling African community members`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-md shadow-sm">
                <Sparkles className="h-3 w-3" />
                Putting A Smile On A Face
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="font-medium drop-shadow-sm flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
                  Life Helpers Initiative — {program.name} Pillar
                </span>
                <span className="rounded-full bg-black/40 px-2.5 py-0.5 backdrop-blur-md border border-white/20">
                  {program.region}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {program.region}
          </div>
          {program.status === "completed" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Completed
            </span>
          )}
        </div>

        <h1 className="mt-2 font-serif-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {program.name}
        </h1>

        <p className="mt-3 text-lg font-medium text-primary">
          {program.summary}
        </p>

        <div className="mt-8 flex flex-col gap-4 text-muted-foreground text-base leading-relaxed">
          {program.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              {program.metricLabel}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-primary">
              {program.metricValue}
            </dd>
          </div>
          {program.stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>

        {/* Linked Projects & Interventions Section */}
        {linkedProjects.length > 0 && (
          <div className="mt-14 rounded-3xl border border-border bg-muted/20 p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <FolderGit2 size={14} />
                  <span>Impact &middot; Projects &amp; Interventions</span>
                </div>
                <h2 className="mt-1 font-serif-display text-xl font-bold text-foreground sm:text-2xl">
                  Active Projects in {program.name}
                </h2>
              </div>
              <Link
                href="/interventions/projectandintervention"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>View All Interventions ({allProjects.length})</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              These field-level interventions are currently or previously implemented under our {program.name} thematic portfolio across Nigeria:
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {linkedProjects.map((project) => (
                <div
                  key={project.id}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-2xs hover:border-primary/50 hover:shadow-xs transition-all"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted mb-3">
                      <Image
                        src={project.image.src}
                        alt={project.image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-md">
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-primary">
                      <Building2 size={12} />
                      <span className="line-clamp-1">{project.donor}</span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin size={11} className="text-primary shrink-0" />
                      <span className="line-clamp-1">{project.locations}</span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px]">
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-primary" />
                      <span>{project.duration}</span>
                    </span>
                    <Link
                      href={`/interventions/${project.id}`}
                      className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Full Details</span>
                      <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 border-t border-border pt-8 flex flex-wrap items-center justify-between gap-4">
          <Button asChild size="lg">
            <Link href="/donate">Support this work</Link>
          </Button>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link
              href="/interventions/projectandintervention"
              className="text-muted-foreground hover:text-foreground"
            >
              All Projects &amp; Interventions &rarr;
            </Link>
            <Link
              href="/success-stories"
              className="text-primary hover:underline"
            >
              Read beneficiary stories &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
