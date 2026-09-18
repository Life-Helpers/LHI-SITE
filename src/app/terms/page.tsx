import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms governing use of the ${siteConfig.name} website.`,
};

export default function TermsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div
          role="note"
          className="mb-8 rounded-md border border-dashed border-alert-border bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          <strong className="text-foreground">Draft placeholder.</strong> This
          page has not been reviewed by an attorney and must not be published
          as-is. It exists to show the intended structure of real terms of
          service.
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: [date]
        </p>

        <div className="mt-8 flex flex-col gap-8 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Acceptance of terms
            </h2>
            <p className="mt-2">
              Placeholder: By using this website, you agree to these terms.
              If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Donations
            </h2>
            <p className="mt-2">
              Placeholder: Donations made through this site are voluntary.
              [Refund policy to be defined.] Donations are processed by
              Stripe; by donating you also agree to Stripe&apos;s terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Use of this site
            </h2>
            <p className="mt-2">
              Placeholder: You agree not to misuse this site, including
              attempting to disrupt it or submit false information through
              its forms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Disclaimer
            </h2>
            <p className="mt-2">
              Placeholder: This site and its content are provided &quot;as
              is&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Governing law
            </h2>
            <p className="mt-2">Placeholder: [Jurisdiction to be defined.]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
