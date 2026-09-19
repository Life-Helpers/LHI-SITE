import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

export function RadioBanner() {
  return (
    <section
      aria-labelledby="radio-heading"
      className="border-t border-border bg-gradient-to-br from-primary to-accent"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Radio
            className="mt-1 h-8 w-8 shrink-0 text-primary-foreground"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary-foreground uppercase">
              Radio Advocacy
            </p>
            <h2
              id="radio-heading"
              className="mt-1 text-2xl font-bold tracking-tight text-primary-foreground"
            >
              The Women Situation Room
            </h2>
            <p className="mt-2 max-w-xl text-primary-foreground">
              A weekly radio program on women&apos;s civic rights,
              reproductive healthcare, and leadership development — reaching
              communities radio can access that other channels can&apos;t.
            </p>
          </div>
        </div>

        <Link
          href="/radio"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Learn more
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
