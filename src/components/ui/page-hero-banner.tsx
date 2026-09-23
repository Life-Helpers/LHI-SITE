import Image from "next/image";
import { type ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface PageHeroBannerProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  description?: string;
  image: {
    src: string;
    alt: string;
    caption?: string;
    tag?: string;
  };
  children?: ReactNode;
  align?: "left" | "center" | "split";
}

export function PageHeroBanner({
  eyebrow,
  title,
  subtitle,
  description,
  image,
  children,
  align = "split",
}: PageHeroBannerProps) {
  if (align === "split") {
    return (
      <section className="relative isolate border-b border-border bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Text Column */}
            <div className="lg:col-span-7">
              {eyebrow && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                  {eyebrow}
                </p>
              )}
              <h1 className="mt-3 font-serif-display text-3xl font-light text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-4 text-lg font-medium text-foreground sm:text-xl">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {description}
                </p>
              )}
              {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
            </div>

            {/* Visual Image Column with African Fulfillment & Smile */}
            <div className="lg:col-span-5">
              <div className="group relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card p-2 shadow-xl ring-1 ring-black/5 transition-all hover:border-primary/40 dark:ring-white/5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 480px"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {image.tag && (
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur-md shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      {image.tag}
                    </div>
                  )}
                  {image.caption && (
                    <div className="absolute right-3 bottom-3 left-3 rounded-xl bg-background/85 p-2.5 backdrop-blur-md">
                      <p className="text-[11px] font-medium text-foreground leading-snug">
                        &ldquo;{image.caption}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full-width banner style
  return (
    <section className="relative isolate border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-serif-display text-3xl font-light text-foreground sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-foreground">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
          {children && <div className="mt-6 flex justify-center gap-3">{children}</div>}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-xl">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              referrerPolicy="no-referrer"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {image.caption && (
              <div className="absolute right-4 bottom-4 left-4 max-w-lg rounded-xl bg-background/90 p-3 backdrop-blur-md">
                <p className="text-xs font-medium text-foreground leading-snug">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
