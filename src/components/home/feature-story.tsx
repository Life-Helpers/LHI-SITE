import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CmsSettings } from "@/lib/cms/schema";
import { isUnoptimized } from "@/lib/image";

/** Editor-managed "feature story" band, configured under Admin → Settings. */
export function FeatureStory({ feature }: { feature: CmsSettings["homeFeature"] }) {
  if (!feature.enabled || !feature.title) return null;
  return (
    <section aria-labelledby="feature-story-heading" className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {feature.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted shadow-xl">
            <Image
              src={feature.image}
              unoptimized={isUnoptimized(feature.image)}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          </div>
        )}
        <div className={feature.image ? "" : "lg:col-span-2 lg:max-w-3xl"}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— {feature.eyebrow}</p>
          <h2 id="feature-story-heading" className="mt-3 font-serif-display text-3xl font-light leading-tight text-foreground sm:text-5xl">
            {feature.title}
          </h2>
          {feature.excerpt && (
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{feature.excerpt}</p>
          )}
          {feature.linkHref && (
            <Link
              href={feature.linkHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              {feature.linkLabel || "Read more"} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
