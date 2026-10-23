"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  ShieldCheck,
  UserCircle,
  UserCog,
  Users,
  UsersRound,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const ICONS = {
  dashboard: LayoutDashboard,
  me: UserCircle,
  team: UsersRound,
  employees: Users,
  departments: Building2,
  leave: CalendarDays,
  accounts: UserCog,
  roles: ShieldCheck,
  audit: ClipboardList,
  reports: BarChart3,
} as const;
export type NavIcon = keyof typeof ICONS;

export interface ShellNavGroup {
  label: string;
  items: { href: string; label: string; icon: NavIcon; active: boolean; badge?: number; children?: { href: string; label: string; active: boolean }[] }[];
}

export interface Crumb {
  label: string;
  href?: string;
}

const COLLAPSE_KEY = "lhi_hr_sidebar_collapsed";

/**
 * Portal frame: collapsible sidebar, top bar with breadcrumbs, theme switch and user menu.
 * Display only; what a person may open is decided on the server for every page.
 */
export function ShellFrame({
  nav,
  crumbs,
  user,
  signOutAction,
  children,
}: {
  nav: ShellNavGroup[];
  crumbs: Crumb[];
  user: { name: string; email: string; role: string; initials: string; tone: string };
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((c) => {
        try {
          localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
        } catch {
          /* storage unavailable */
        }
        return !c;
      });
    } else {
      setMobileOpen((o) => !o);
    }
  };

  return (
    <div className="flex min-h-screen border-t-[3px] border-admin-primary">
      {mobileOpen && <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-admin-border bg-admin-nav transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[76px]" : "lg:w-64"}`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-admin-border px-4">
          <Link href="/hrportal" className="flex min-w-0 items-center gap-2">
            <Image src="/logo.png" alt="Life Helpers Initiative" width={120} height={34} className={`h-8 w-auto ${collapsed ? "lg:hidden" : ""}`} />
            <span className={`truncate text-xs font-semibold uppercase tracking-wider text-admin-primary ${collapsed ? "lg:hidden" : ""}`}>HR Portal</span>
            {collapsed && (
              <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-admin-primary text-sm font-bold text-white lg:flex" aria-hidden="true">
                HR
              </span>
            )}
          </Link>
          <button type="button" aria-label="Close menu" className="rounded p-1 text-admin-muted lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="HR portal" className="flex-1 overflow-y-auto px-3 py-4">
          {nav.map((group) => (
            <div key={group.label} className="mb-5">
              <p className={`mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-admin-muted ${collapsed ? "lg:sr-only" : ""}`}>{group.label}</p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon];
                  if (item.children) {
                    const open = item.children.some((c) => c.active);
                    return (
                      <li key={item.href}>
                        <details open={open} className="group/sub">
                          <summary
                            title={collapsed ? item.label : undefined}
                            className={`flex cursor-pointer list-none items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium [&::-webkit-details-marker]:hidden ${
                              open ? "text-admin-primary" : "text-admin-nav-text hover:bg-admin-nav-hover hover:text-admin-text"
                            } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                          >
                            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                            <span className={`flex-1 ${collapsed ? "lg:sr-only" : ""}`}>{item.label}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform group-open/sub:rotate-180 ${collapsed ? "lg:hidden" : ""}`} aria-hidden="true" />
                          </summary>
                          <ul className={`ml-5 mt-0.5 space-y-0.5 border-l border-admin-border pl-2 ${collapsed ? "lg:ml-0 lg:border-l-0 lg:pl-0" : ""}`}>
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  aria-current={c.active ? "page" : undefined}
                                  onClick={() => setMobileOpen(false)}
                                  className={`relative block rounded-md px-3 py-1.5 text-sm ${
                                    c.active ? "font-semibold text-admin-primary before:absolute before:-left-[9px] before:top-1 before:bottom-1 before:w-[3px] before:rounded before:bg-admin-primary" : "text-admin-text hover:bg-admin-nav-hover"
                                  } ${collapsed ? "lg:text-[11px] lg:px-1 lg:text-center" : ""}`}
                                >
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        aria-current={item.active ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          item.active ? "bg-admin-primary-soft text-admin-primary" : "text-admin-nav-text hover:bg-admin-nav-hover hover:text-admin-text"
                        } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                        <span className={`flex-1 ${collapsed ? "lg:sr-only" : ""}`}>{item.label}</span>
                        {item.badge ? (
                          <span className={`rounded-full bg-admin-warning px-1.5 text-[11px] font-semibold text-white ${collapsed ? "lg:hidden" : ""}`} aria-label={`${item.badge} waiting for your decision`}>
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-admin-border bg-admin-card/90 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={toggle} aria-label="Toggle sidebar" className="rounded-lg p-1.5 text-admin-text hover:bg-admin-bg">
            <PanelLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex min-w-0 items-center gap-1.5 text-sm">
              {crumbs.map((c, i) => (
                <li key={`${c.label}-${i}`} className={`min-w-0 items-center gap-1.5 ${i === crumbs.length - 1 ? "flex" : "hidden sm:flex"}`}>
                  {i > 0 && <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-admin-muted sm:block" aria-hidden="true" />}
                  {c.href && i < crumbs.length - 1 ? (
                    <Link href={c.href} className="truncate text-admin-text hover:text-admin-primary">
                      {c.label}
                    </Link>
                  ) : (
                    <span className={`truncate ${i === crumbs.length - 1 ? "font-semibold text-admin-text" : "text-admin-text"}`} aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <ThemeToggle />
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-admin-bg [&::-webkit-details-marker]:hidden">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${user.tone}`} aria-hidden="true">
                {user.initials}
              </span>
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-sm font-semibold text-admin-text">{user.name}</span>
                <span className="block text-xs text-admin-muted">{user.email}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-admin-muted transition-transform group-open:rotate-180" aria-hidden="true" />
              <span className="sr-only">Account menu</span>
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-admin-border bg-admin-card p-2 shadow-lg">
              <p className="px-3 py-2 text-xs text-admin-muted">
                Signed in as <span className="font-semibold text-admin-text">{user.role}</span>
              </p>
              <Link href="/hrportal/me" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-admin-bg">
                <UserCircle className="h-4 w-4" aria-hidden="true" /> My record
              </Link>
              <Link href="/hrportal/password" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-admin-bg">
                <KeyRound className="h-4 w-4" aria-hidden="true" /> Change password
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-admin-danger hover:bg-admin-danger-soft">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </button>
              </form>
            </div>
          </details>
        </header>
        <main id="main-content" tabIndex={-1} className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
