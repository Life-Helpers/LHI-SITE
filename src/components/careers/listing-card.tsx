import Link from "next/link";
import { ArrowRight, CalendarClock, MapPin } from "lucide-react";

export function formatDeadline(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Card used for both vacancies and vendor requests. */
export function ListingCard({
  href,
  eyebrow,
  badge,
  title,
  summary,
  location,
  deadline,
  closed,
}: {
  href: string;
  eyebrow: string;
  badge: string;
  title: string;
  summary: string;
  location: string;
  deadline: string;
  closed?: string;
}) {
  return (
    <Link href={href} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{eyebrow}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${closed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
          {closed ?? badge}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-primary">{title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{summary}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {location}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-primary" /> {closed ? "Closed" : `Closes ${formatDeadline(deadline)}`}</span>
        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
