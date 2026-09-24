"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/social-links";
import { useLocale } from "@/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteFooter() {
  const { t } = useLocale();

  const whoWeAreLinks = [
    { label: t.whoWeAreMenu.aboutUs, href: "/about" },
    { label: t.whoWeAreMenu.ourHistory, href: "/our-history" },
    { label: t.whoWeAreMenu.ourCommitment, href: "/our-commitment" },
    { label: t.whoWeAreMenu.ourStrategies, href: "/our-strategies" },
    { label: t.whoWeAreMenu.boardOfTrustees, href: "/board-of-trustees" },
    { label: t.whoWeAreMenu.managementTeam, href: "/management-team" },
    { label: t.whoWeAreMenu.nidake, href: "/nidake" },
  ];

  const programLinks = [
    { label: t.footer.programs, href: "/programs" },
    { label: t.whatWeDoMenu.health, href: "/health" },
    { label: t.whatWeDoMenu.education, href: "/education" },
    { label: t.whatWeDoMenu.livelihood, href: "/livelihood" },
    { label: t.whatWeDoMenu.foodSecurity, href: "/food-security" },
    { label: t.whatWeDoMenu.socialInclusion, href: "/social-inclusion" },
    { label: t.whatWeDoMenu.protection, href: "/protection" },
    { label: t.whatWeDoMenu.radioAdvocacy, href: "/radio" },
  ];

  const impactLinks = [
    { label: t.footer.emergencies, href: "/emergencies" },
    { label: t.footer.impactReports, href: "/impact" },
    { label: t.impactMenu.projectsInterventions, href: "/interventions/projectandintervention" },
    { label: t.impactMenu.successStories, href: "/success-stories" },
    { label: "LHI Blog & Newsletter", href: "/blog" },
    { label: "Events & Observance Days", href: "/events" },
    { label: "Fact Sheet", href: "/fact-sheet" },
    { label: "Brochure", href: "/brochure" },
    { label: "Feedback", href: "/feedback" },
  ];

  const getInvolvedLinks = [
    { label: t.nav.donate, href: "/donate" },
    { label: t.nav.getInvolved, href: "/get-involved" },
    { label: "Frequently Asked Questions", href: "/faq" },
    { label: "Careers & Vacancies", href: "/careers" },
    { label: "Humanitarian Training", href: "/get-involved/training" },
    { label: "Vendor Requests", href: "/procurement" },
    { label: t.footer.contact, href: "/contact" },
    { label: t.footer.privacy, href: "/privacy" },
    { label: t.footer.terms, href: "/terms" },
  ];

  return (
    <footer className="relative mt-20 border-t border-border bg-card/30 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand & Contact summary */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                width={1533}
                height={440}
                sizes="160px"
                referrerPolicy="no-referrer"
                className="h-9 w-auto sm:h-10"
              />
            </Link>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {t.footer.tagline}
            </p>

            <div className="mt-3 flex flex-col gap-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                <span>
                  {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}, Nigeria
                </span>
              </div>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>Helpline: {siteConfig.contact.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{siteConfig.contact.email}</span>
              </a>
            </div>

            <SocialLinks className="mt-4" />

          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {/* Who We Are */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {t.footer.whoWeAreHeading}
              </p>
              <ul className="mt-3.5 flex flex-col gap-2">
                {whoWeAreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Programs */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {t.footer.programsHeading}
              </p>
              <ul className="mt-3.5 flex flex-col gap-2">
                {programLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact & Updates */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {t.footer.impactHeading}
              </p>
              <ul className="mt-3.5 flex flex-col gap-2">
                {impactLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Involved & Admin */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {t.footer.getInvolvedHeading}
              </p>
              <ul className="mt-3.5 flex flex-col gap-2">
                {getInvolvedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/80 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span>
              © {new Date().getFullYear()} {siteConfig.name}. {t.footer.rights}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <LanguageSwitcher />
            <span className="text-border" aria-hidden="true">•</span>
            <Link
              href="/faq"
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <span className="text-border" aria-hidden="true">•</span>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              {t.footer.privacy}
            </Link>
            <span className="text-border" aria-hidden="true">•</span>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              {t.footer.terms}
            </Link>
            <span className="text-border" aria-hidden="true">•</span>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              {t.footer.contact}
            </Link>
            <span className="text-border" aria-hidden="true">•</span>
            <Link
              href="/admin/login"
              id="footer-bottom-admin-login"
              className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
            >
              <Lock className="h-3 w-3 text-primary" aria-hidden="true" />
              {t.footer.adminLogin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
