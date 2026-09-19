"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { useLocale } from "@/i18n/locale-context";

export function SiteFooter() {
  const { t } = useLocale();

  const footerLinks = [
    { label: t.footer.emergencies, href: "/emergencies" },
    { label: t.footer.programs, href: "/programs" },
    { label: t.footer.impactReports, href: "/impact" },
    { label: t.footer.about, href: "/about" },
    { label: t.footer.contact, href: "/contact" },
    { label: t.footer.privacy, href: "/privacy" },
    { label: t.footer.terms, href: "/terms" },
  ];

  return (
    <footer className="relative mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {t.footer.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {siteConfig.name}. {t.footer.rights}
      </div>
    </footer>
  );
}
