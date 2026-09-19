import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Data Protection &amp; Beneficiary Dignity"
        title={
          <>
            Privacy <em className="font-light italic text-primary">Policy.</em>
          </>
        }
        subtitle="Safeguarding beneficiary trust, personal information, and community rights."
        description={`How ${siteConfig.name} collects, uses, and protects your information in strict accordance with international humanitarian safeguarding guidelines.`}
        image={africanFulfillmentImages.commitmentHero}
      />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div
          role="note"
          className="mb-8 rounded-md border border-dashed border-alert-border bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          <strong className="text-foreground">Draft placeholder.</strong> This
          page has not been reviewed by an attorney and must not be published
          as-is. It exists to show the intended structure of a real privacy
          policy.
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: [date]
        </p>

        <div className="mt-8 flex flex-col gap-8 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Information we collect
            </h2>
            <p className="mt-2">
              Placeholder: When you make a donation, we collect your name,
              email address, and any optional message you include. We do not
              collect or store your card details — those are entered directly
              into our payment processor Stripe&apos;s own secure form and
              never reach our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              How we use it
            </h2>
            <p className="mt-2">
              Placeholder: We use this information to process your donation,
              send a receipt, and respond to inquiries you send us. We do not
              sell donor information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Third parties
            </h2>
            <p className="mt-2">
              Placeholder: Payments are processed by Stripe, Inc. Stripe
              handles your payment details under its own privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Your rights
            </h2>
            <p className="mt-2">
              Placeholder: To request access to, correction of, or deletion of
              your information, contact us using the details on the Contact
              page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
