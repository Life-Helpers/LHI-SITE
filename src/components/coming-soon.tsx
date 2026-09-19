import Link from "next/link";
import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  note,
  seeAlso,
}: {
  title: string;
  note: string;
  seeAlso?: { label: string; href: string };
}) {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>

        <div className="mt-8 flex flex-col items-start gap-3 rounded-md border border-dashed border-border p-6 text-muted-foreground">
          <Construction className="h-6 w-6" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            This page is coming soon
          </p>
          <p className="text-sm">{note}</p>
          {seeAlso && (
            <Link
              href={seeAlso.href}
              className="rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {seeAlso.label} →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
