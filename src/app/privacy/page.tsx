import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { siteConfig } from "@/config/site";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects personal data under the Nigeria Data Protection Act 2023.`,
};

// Drafted from how this website actually handles data. LHI's legal counsel should review it
// (and confirm the Data Protection Officer contact) before launch.
const UPDATED = "23 September 2026";
const email = siteConfig.contact.email;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          {siteConfig.name} (&ldquo;LHI&rdquo;, &ldquo;we&rdquo;) is a non-governmental, not-for-profit organisation registered with the Corporate
          Affairs Commission ({siteConfig.cacRegistration}), with headquarters at Goshen Development Center, Tamaje Gagi, Old Airport Area, Eastern
          Bypass Road, Sokoto, Nigeria. We are the data controller for personal data collected through this website.
        </p>
        <p>
          We process personal data in line with the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> and the regulations and guidance of the
          Nigeria Data Protection Commission (NDPC).
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect and why",
    body: (
      <>
        <p>We only collect what we need for each purpose:</p>
        <ul>
          <li>
            <strong>Donations:</strong> your name, email, amount and any message. Card details are entered directly into our payment processor
            (Stripe) and never reach our servers. Purpose: to process your gift and send a receipt. Lawful basis: contract.
          </li>
          <li>
            <strong>Newsletter and downloads:</strong> your email and, optionally, your name, plus the source of your sign-up (for example a
            document download). Purpose: to send LHI news, magazines and reports. Lawful basis: consent, which you can withdraw at any time.
          </li>
          <li>
            <strong>Contact, volunteer and partnership forms:</strong> your name, contact details, organisation and message. Purpose: to reply and
            follow up. Lawful basis: legitimate interest.
          </li>
          <li>
            <strong>Job applications:</strong> your contact details, experience, qualifications, cover letter and CV. Purpose: recruitment,
            including reference and background checks under our safe-recruitment policy. Lawful basis: steps prior to a contract and legitimate
            interest.
          </li>
          <li>
            <strong>Vendor registrations and bids:</strong> company and contact details, registration numbers and your quotation or bid documents.
            Purpose: procurement and due diligence. Lawful basis: steps prior to a contract.
          </li>
          <li>
            <strong>Humanitarian Training accounts:</strong> your name, email, optional organisation, a securely hashed password, your course
            progress, assessment attempts and certificates. Purpose: to provide the courses and issue verifiable certificates. Lawful basis:
            contract.
          </li>
          <li>
            <strong>Comments and likes:</strong> your name, email (never published) and comment. Likes are counted anonymously. Purpose: community
            discussion, moderated before publication. Lawful basis: consent.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sensitive-data",
    title: "Safeguarding and sensitive information",
    body: (
      <p>
        Please do not use website forms to report safeguarding concerns involving named individuals. Use our confidential PSEA channels instead:{" "}
        <a href={`mailto:${siteConfig.contact.pseaEmail}`}>{siteConfig.contact.pseaEmail}</a> or the feedback line {siteConfig.contact.feedbackLine}.
        Such reports are handled under our safeguarding policies with strict confidentiality and on a need-to-know basis.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    body: (
      <>
        <p>We use a small number of essential cookies and browser storage items:</p>
        <ul>
          <li>Sign-in cookies for the training centre and the team admin area (only set when you sign in).</li>
          <li>
            Browser storage that remembers your preferences: theme, language, accessibility settings, page-turn sound, radio volume, posts you
            liked, and whether you have subscribed or dismissed the anniversary message.
          </li>
          <li>
            If enabled by LHI, Google Analytics measures anonymous site usage. Embedded content (such as our Facebook page timeline) may set
            cookies from that provider.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share data with",
    body: (
      <>
        <p>We do not sell personal data. We share it only with:</p>
        <ul>
          <li>Service providers that host this website, process payments (Stripe) or send email on our behalf, under contract.</li>
          <li>Donors or partners where a funded project requires it, and only the minimum necessary.</li>
          <li>Authorities where the law requires it, or to protect someone from serious harm.</li>
        </ul>
        <p>
          Some providers may process data outside Nigeria. Where they do, we rely on the safeguards permitted by the NDPA, such as contractual
          protections.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <ul>
        <li>Newsletter subscriptions: until you unsubscribe.</li>
        <li>Unsuccessful job applications and vendor bids: up to 24 months, then deleted.</li>
        <li>Training accounts: until you ask us to delete your account. Certificate records are kept so they can still be verified.</li>
        <li>Donation records: as long as required for financial and audit obligations.</li>
        <li>Contact messages and comments: up to 24 months, unless needed for an ongoing matter.</li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "How we protect data",
    body: (
      <p>
        Passwords are stored only as salted hashes. CVs and bid documents are stored privately and are available only to authorised LHI staff.
        Access to the admin area is restricted by role, and we keep an activity log of administrative actions.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the NDPA you can ask us to:</p>
        <ul>
          <li>give you a copy of the personal data we hold about you;</li>
          <li>correct inaccurate data or delete data we no longer need;</li>
          <li>restrict or object to certain processing, or move your data to another organisation;</li>
          <li>withdraw consent at any time (for example, by unsubscribing from the newsletter).</li>
        </ul>
        <p>
          Email <a href={`mailto:${email}?subject=Data%20protection%20request`}>{email}</a> with the subject &ldquo;Data protection request&rdquo;.
          We will respond within 30 days. If you are not satisfied, you may complain to the Nigeria Data Protection Commission.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is not directed at children under 13, and we do not knowingly collect their data online. Our work with children in communities
        follows our Child Safeguarding Policy, including consent and dignity standards for photographs and stories.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as our website and services change. The date at the top shows when it was last updated. See also our{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Data Protection"
        title={
          <>
            Privacy <em className="font-light italic text-primary">Policy.</em>
          </>
        }
        subtitle="How we collect, use and protect your personal data."
        description="We respect the privacy of donors, learners, applicants, partners and the communities we serve."
        image={africanFulfillmentImages.commitmentHero}
      />
      <LegalDocument
        title="Privacy Policy"
        updated={UPDATED}
        intro={<p>This policy explains what personal data we collect through this website, why we collect it, and the choices and rights you have.</p>}
        sections={sections}
      />
    </main>
  );
}
