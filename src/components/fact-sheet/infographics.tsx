import Image from "next/image";
import { Download, Maximize2 } from "lucide-react";

export const INFOGRAPHICS_PDF = "/documents/lhi-infographics.pdf";

export const INFOGRAPHICS = [
  {
    src: "/infographics/lhi-at-a-glance.webp",
    full: "/infographics/lhi-at-a-glance.jpg",
    title: "Life Helpers Initiative at a glance",
    alt: "Infographic: LHI's staff and volunteers, beneficiaries, household reach, partnerships, state offices on a map of Nigeria, mission, vision, values and five thematic areas",
  },
  {
    src: "/infographics/lhi-nutrition-project-journey.webp",
    full: "/infographics/lhi-nutrition-project-journey.jpg",
    title: "LHI Nutrition Project: a journey towards healthier communities",
    alt: "Infographic: the fourteen steps of LHI's nutrition project, from healthcare services and awareness creation to RUTF, counselling, food demonstrations, home gardens and healthy children",
  },
];

/** The two LHI infographics, shown on the Fact Sheet and Brochure pages. */
export function Infographics({ headingId = "infographics-heading", eyebrow = "— Infographics" }: { headingId?: string; eyebrow?: string }) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h2 id={headingId} className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            LHI <em className="font-light italic text-primary">at a glance.</em>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Who we are, where we work, what we do, and how our nutrition project works step by step.</p>
        </div>
        <a
          href={INFOGRAPHICS_PDF}
          download
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Download infographics (PDF)
        </a>
      </div>
      <div className="mt-10 space-y-8">
        {INFOGRAPHICS.map((g) => (
          <figure key={g.src} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <a href={g.full} target="_blank" rel="noopener noreferrer" className="group relative block" aria-label={`Open "${g.title}" full size`}>
              <Image src={g.src} alt={g.alt} width={2000} height={1415} sizes="(min-width: 1152px) 1152px, 100vw" className="h-auto w-full" />
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> Full size
              </span>
            </a>
            <figcaption className="border-t border-border px-5 py-3 text-sm font-medium text-foreground">{g.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
