import type { Metadata } from "next";

import { UnsubscribeForm } from "./unsubscribe-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ e?: string; t?: string }> }) {
  const { e = "", t = "" } = await searchParams;
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-32">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Newsletter</p>
        <h1 className="mt-2 mb-6 font-serif-display text-3xl font-light text-foreground">Unsubscribe</h1>
        {e && t ? (
          <UnsubscribeForm email={e} token={t} />
        ) : (
          <p className="text-sm text-muted-foreground">Please use the unsubscribe link at the bottom of one of our emails.</p>
        )}
      </div>
    </main>
  );
}
