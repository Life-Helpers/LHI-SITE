import Image from "next/image";
import Link from "next/link";

import { hrSignOutAction } from "@/app/hrportal/actions";
import { ShellFrame, type Crumb, type NavIcon, type ShellNavGroup } from "@/components/hr/shell-frame";
import { initialsOf, toneFor } from "@/components/hr/ui";
import { has, homePath } from "@/lib/hr/access";
import type { HrContext } from "@/lib/hr/session";
import type { HrPermission } from "@/lib/hr/types";

/** Menu built from the signed-in person's permissions (display only: every page checks again). */
const NAV: { group: string; href: string; label: string; icon: NavIcon; any: HrPermission[] }[] = [
  { group: "Overview", href: "/hrportal/hr", label: "Dashboard", icon: "dashboard", any: ["employees.view", "employees.manage", "accounts.manage"] },
  { group: "Overview", href: "/hrportal/reports", label: "Reports", icon: "reports", any: ["reports.view"] },
  { group: "Me", href: "/hrportal/me", label: "My record", icon: "me", any: ["self.view"] },
  { group: "Me", href: "/hrportal/team", label: "My team", icon: "team", any: ["team.view"] },
  { group: "HR", href: "/hrportal/hr/employees", label: "Employees", icon: "employees", any: ["employees.view", "employees.manage"] },
  { group: "HR", href: "/hrportal/hr/leave", label: "Leave applications", icon: "leave", any: ["leave.view_all", "leave.manage"] },
  { group: "Administration", href: "/hrportal/hr/accounts", label: "Accounts", icon: "accounts", any: ["accounts.manage"] },
  { group: "Administration", href: "/hrportal/hr/roles", label: "Roles & permissions", icon: "roles", any: ["roles.manage"] },
  { group: "Administration", href: "/hrportal/hr/audit", label: "Audit trail", icon: "audit", any: ["audit.view"] },
];

export function PortalShell({ ctx, current, crumbs = [], children }: { ctx: HrContext; current: string; crumbs?: Crumb[]; children: React.ReactNode }) {
  const groups: ShellNavGroup[] = [];
  for (const n of NAV.filter((item) => item.any.some((p) => has(ctx.permissions, p)))) {
    const active = current === n.href || (n.href !== "/hrportal/hr" && current.startsWith(`${n.href}/`));
    const group = groups.find((g) => g.label === n.group) ?? groups[groups.push({ label: n.group, items: [] }) - 1];
    group.items.push({ href: n.href, label: n.label, icon: n.icon, active });
  }
  return (
    <ShellFrame
      nav={groups}
      crumbs={[{ label: "Dashboard", href: homePath(ctx.permissions) }, ...crumbs]}
      user={{ name: ctx.displayName, email: ctx.account.email, role: ctx.role.name, initials: initialsOf(ctx.displayName), tone: toneFor(ctx.displayName) }}
      signOutAction={hrSignOutAction}
    >
      {children}
    </ShellFrame>
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
