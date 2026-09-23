import Link from "next/link";
import { ArrowLeft, Home, HeartHandshake } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mx-auto max-w-md">
        <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          404 Error
        </span>
        <h1 className="mt-4 font-serif-display text-4xl font-light text-foreground sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let us help you find what you need.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted transition-colors"
          >
            <HeartHandshake className="h-4 w-4 text-primary" />
            Contact Support
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card/60 p-4 text-left">
          <p className="text-xs font-semibold text-foreground">Popular Destinations:</p>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
                <ArrowLeft className="h-3 w-3 rotate-180" /> About Life Helpers Initiative
              </Link>
            </li>
            <li>
              <Link href="/interventions/projectandintervention" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
                <ArrowLeft className="h-3 w-3 rotate-180" /> Projects & Interventions
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
                <ArrowLeft className="h-3 w-3 rotate-180" /> Support Our Mission (Donate)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
