import type { Metadata } from "next";
import { Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Radio Advocacy",
  description:
    "The Women Situation Room: LHI's weekly radio outreach on women's civic rights, reproductive healthcare, and leadership development.",
};

export default function RadioAdvocacyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Radio className="h-4 w-4" aria-hidden="true" />
          Radio Advocacy
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          The Women Situation Room
        </h1>
        <p className="mt-6 text-muted-foreground">
          A weekly radio program giving strategic outreach on women&apos;s
          civic rights, reproductive healthcare, and leadership development —
          part of LHI&apos;s Social Inclusion work, reaching communities
          radio can access that other channels can&apos;t.
        </p>
      </div>
    </main>
  );
}
