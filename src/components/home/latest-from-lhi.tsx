import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";

const columns = [
  {
    icon: Calendar,
    label: "Events & Updates",
    href: "/events",
    note: "We don't invent event dates — this section will list real LHI events and announcements once they're scheduled.",
  },
  {
    icon: Newspaper,
    label: "Blog",
    href: "/blog",
    note: "No posts have been published yet — field stories and updates will appear here once they exist.",
  },
];

export function LatestFromLHI() {
  return (
    <section
      aria-labelledby="latest-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
    >
      <div className="mb-8 flex flex-col gap-2">
        <h2 id="latest-heading" className="text-2xl font-bold tracking-tight">
          Latest from LHI
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Events, announcements, and stories from the field.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {columns.map((column) => (
          <div
            key={column.href}
            className="flex flex-col gap-3 rounded-md border border-dashed border-border p-6"
          >
            <column.icon
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="font-semibold">{column.label}</h3>
            <p className="text-sm text-muted-foreground">{column.note}</p>
            <Link
              href={column.href}
              className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Visit {column.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
