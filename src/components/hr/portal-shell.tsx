import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { hrSignOutAction } from "@/app/hrportal/actions";
import { has } from "@/lib/hr/access";
import type { HrContext } from "@/lib/hr/session";
import type { HrPermission } from "@/lib/hr/types";

/** Navigation built from the signed-in person's permissions (display only: pages check again). */
const NAV: { href: string; label: string; any: HrPermission[] }[] = [
  { href: "/hrportal/me", label: "My record", any: ["self.view"] },
  { href: "/hrportal/team", label: "My team", any: ["team.view"] },
  { href: "/hrportal/hr", label: "HR overview", any: ["employees.view", "employees.manage", "accounts.manage"] },
  { href: "/hrportal/hr/employees", label: "Employees", any: ["employees.view", "employees.manage"] },
  { href: "/hrportal/hr/leave", label: "Leave", any: ["leave.view_all", "leave.manage"] },
  { href: "/hrportal/hr/accounts", label: "Accounts", any: ["accounts.manage"] },
  { href: "/hrportal/hr/roles", label: "Roles", any: ["roles.manage"] },
  { href: "/hrportal/hr/audit", label: "Audit trail", any: ["audit.view"] },
  { href: "/hrportal/reports", label: "Reports", any: ["reports.view"] },
];

export function PortalShell({ ctx, current, children }: { ctx: HrContext; current: string; children: React.ReactNode }) {
  const links = NAV.filter((n) => n.any.some((p) => has(ctx.permissions, p)));
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-admin-border bg-admin-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/hrportal" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Life Helpers Initiative" width={130} height={38} className="h-8 w-auto" />
            <span className="text-sm font-semibold text-admin-text">HR Portal</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-right sm:block">
              <span className="block font-semibold text-admin-text">{ctx.displayName}</span>
              <span className="block text-xs text-admin-muted">{ctx.role.name}</span>
            </span>
            <form action={hrSignOutAction}>
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text hover:bg-admin-bg">
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="HR portal" className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <ul className="flex gap-1">
            {links.map((l) => {
              const active = current === l.href || (l.href !== "/hrportal/hr" && current.startsWith(`${l.href}/`));
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`block whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium ${
                      active ? "border-admin-primary text-admin-primary" : "border-transparent text-admin-muted hover:text-admin-text"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}

/** Centered card for the sign-in and account-link pages. */
export function PortalAuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Life Helpers Initiative" width={180} height={52} className="h-11 w-auto" priority />
          <h1 className="mt-6 text-2xl font-bold text-admin-text">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-admin-muted">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-card p-7 shadow-sm">{children}</div>
        <p className="mt-6 text-center text-xs text-admin-muted">
          <Link href="/" className="hover:text-admin-primary">
            ← Back to the LHI website
          </Link>
        </p>
      </div>
    </main>
  );
}
