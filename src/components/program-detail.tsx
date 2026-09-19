import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Program } from "@/types/content";

export function ProgramDetail({ program }: { program: Program }) {
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

        <div className="mt-10 border-t border-border pt-8 flex flex-wrap items-center justify-between gap-4">
          <Button asChild size="lg">
            <Link href="/donate">Support this work</Link>
          </Button>
          <Link
            href="/success-stories"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Read beneficiary success stories →
          </Link>
        </div>
      </div>
    </main>
  );
}
