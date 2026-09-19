import Link from "next/link";
import { ArrowRight } from "lucide-react";

const coreValues = [
  "Grassroots first",
  "Multi-sectoral by design",
  "Zero tolerance for exploitation",
];

export function WhoWeAreBand() {
  return (
    <section
      aria-labelledby="who-we-are-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
    >
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">
          Who We Are
        </p>
        <h2 id="who-we-are-heading" className="text-2xl font-bold tracking-tight">
          Since 2004, working across Northern Nigeria
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Founded as Beulah Projects in Sokoto, LHI has grown into a national
          NGO combining development programming, humanitarian relief, and
          disaster risk reduction.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-md border border-border p-5">
          <h3 className="font-semibold">Our Vision</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            &ldquo;Touching Lives, Transforming Households, Impacting
            Communities.&rdquo;
          </p>
        </div>
        <div className="rounded-md border border-border p-5">
          <h3 className="font-semibold">Our Mission</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Combining development programming, emergency humanitarian
            relief, resilience building, and disaster risk reduction for
            vulnerable households across 11 Nigerian states.
          </p>
        </div>
        <div className="rounded-md border border-border p-5">
          <h3 className="font-semibold">Our Core Values</h3>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            {coreValues.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href="/about"
        className="mt-6 inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        More about LHI
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}
