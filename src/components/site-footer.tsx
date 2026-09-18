import Link from "next/link";

const footerLinks = [
  { label: "Emergencies", href: "/emergencies" },
  { label: "Programs", href: "/programs" },
  { label: "Impact Reports", href: "/impact" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight">
            Life Helpers Initiative
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Rapid crisis response, community programs, and audited impact
            reporting.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Life Helpers Initiative. All rights
        reserved.
      </div>
    </footer>
  );
}
