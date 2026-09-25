"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  BarChart3,
  CalendarHeart,
  CircleHelp,
  Columns2,
  GalleryHorizontal,
  Layers,
  Quote,
  Languages,
  Route,
  UsersRound,
  Activity,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronsLeft,
  ExternalLink,
  FileCheck2,
  FileText,
  FolderKanban,
  GraduationCap,
  BriefcaseBusiness,
  Gavel,
  Handshake,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  Menu,
  Radio,
  MessageSquare,
  Newspaper,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserCircle,
  Users,
  X,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { can, type Permission, type PublicUser } from "@/lib/cms/schema";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: Permission;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function buildNav(newSubmissions: number, pendingComments: number): NavGroup[] {
  return [
    { label: "Home", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
    {
      label: "Content",
      items: [
        { label: "Posts", href: "/admin/content/posts", icon: FileText, permission: "posts.own" },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon, permission: "media" },
        { label: "Comments", href: "/admin/comments", icon: MessageSquare, permission: "comments", badge: pendingComments },
        { label: "Radio Episodes", href: "/admin/content/episodes", icon: Radio, permission: "episodes" },
        { label: "Events", href: "/admin/content/events", icon: CalendarDays, permission: "events" },
        { label: "Magazines", href: "/admin/magazines", icon: BookOpen, permission: "magazines" },
      ],
    },
    {
      label: "Home Page",
      items: [
        { label: "Hero Slides", href: "/admin/content/heroSlides", icon: GalleryHorizontal, permission: "homepage" },
        { label: "Testimonials", href: "/admin/content/testimonials", icon: Quote, permission: "homepage" },
        { label: "Before & After", href: "/admin/content/beforeAfter", icon: Columns2, permission: "homepage" },
        { label: "Home Page Text", href: "/admin/home-text", icon: Languages, permission: "settings" },
      ],
    },
    {
      label: "Pages",
      items: [
        { label: "Thematic Area Pages", href: "/admin/content/thematicAreas", icon: Layers, permission: "pages" },
        { label: "FAQs", href: "/admin/content/faqs", icon: CircleHelp, permission: "pages" },
        { label: "Observance Days", href: "/admin/content/observances", icon: CalendarHeart, permission: "pages" },
      ],
    },
    {
      label: "Impact & Emergencies",
      items: [
        { label: "Impact Reports", href: "/admin/content/impactReports", icon: BarChart3, permission: "impact" },
        { label: "Emergencies & Alerts", href: "/admin/content/emergencies", icon: AlertTriangle, permission: "impact" },
      ],
    },
    {
      label: "About LHI",
      items: [
        { label: "History Timeline", href: "/admin/content/milestones", icon: Route, permission: "about" },
        { label: "Team", href: "/admin/content/team", icon: UsersRound, permission: "about" },
      ],
    },
    {
      label: "Programmes",
      items: [
        { label: "Interventions", href: "/admin/content/interventions", icon: FolderKanban, permission: "interventions" },
        { label: "Map States", href: "/admin/content/states", icon: Map, permission: "states" },
      ],
    },
    {
      label: "Partnerships",
      items: [
        { label: "Partners & Logos", href: "/admin/content/partners", icon: Handshake, permission: "partners" },
        { label: "Compliance Docs", href: "/admin/content/documents", icon: FileCheck2, permission: "documents" },
        { label: "Submissions", href: "/admin/submissions", icon: Inbox, permission: "submissions", badge: newSubmissions },
      ],
    },
    {
      label: "Recruitment & Procurement",
      items: [
        { label: "Jobs & Vacancies", href: "/admin/content/jobs", icon: BriefcaseBusiness, permission: "jobs" },
        { label: "Vendor Requests", href: "/admin/content/tenders", icon: Gavel, permission: "tenders" },
      ],
    },
    {
      label: "Training",
      items: [
        { label: "Learners", href: "/admin/learners", icon: Users, permission: "training" },
        { label: "Certificates", href: "/admin/certificates", icon: GraduationCap, permission: "training" },
      ],
    },
    {
      label: "Communications",
      items: [
        { label: "Newsletter", href: "/admin/newsletter", icon: Newspaper, permission: "newsletter" },
        { label: "Email Outbox", href: "/admin/outbox", icon: Mail, permission: "email" },
      ],
    },
    {
      label: "Administration",
      items: [
        { label: "Users", href: "/admin/users", icon: Users, permission: "users" },
        { label: "Roles & Permissions", href: "/admin/users/roles", icon: ShieldCheck, permission: "users" },
        { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings" },
        { label: "Activity Log", href: "/admin/activity", icon: Activity, permission: "activity" },
      ],
    },
  ];
}

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  user,
  newSubmissions,
  pendingComments = 0,
  children,
}: {
  user: PublicUser;
  newSubmissions: number;
  pendingComments?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closedGroups, setClosedGroups] = useState<string[]>([]);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("lhi_admin_nav_collapsed") === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem("lhi_admin_nav_collapsed", c ? "0" : "1");
      } catch {
        /* storage unavailable */
      }
      return !c;
    });
  };

  const nav = buildNav(newSubmissions, pendingComments)
    .map((g) => ({ ...g, items: g.items.filter((i) => can(user, i.permission)) }))
    .filter((g) => g.items.length > 0);

  const sidebar = (compact: boolean) => (
    <nav aria-label="Admin" className="flex h-full flex-col bg-admin-nav text-admin-nav-text">
      <div className={`flex h-16 shrink-0 items-center border-b border-white/5 ${compact ? "justify-center px-2" : "px-5"}`}>
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white">
            <Image src="/icon.png" alt="" width={32} height={32} className="h-7 w-7 object-contain" />
          </span>
          {!compact && (
            <span className="leading-tight">
              <span className="block text-sm font-bold text-white">LHI Admin</span>
              <span className="block text-[10px] uppercase tracking-widest">Content Manager</span>
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {nav.map((group) => {
          const open = !closedGroups.includes(group.label);
          return (
            <div key={group.label} className="mb-3">
              {compact ? (
                <div className="mx-auto my-2 h-px w-6 bg-white/10" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setClosedGroups((g) => (open ? [...g, group.label] : g.filter((l) => l !== group.label)))
                  }
                  aria-expanded={open}
                  className="flex w-full items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-admin-nav-text/70 hover:text-white"
                >
                  {group.label}
                  <ChevronDown className={`h-3 w-3 transition-transform ${open ? "" : "-rotate-90"}`} />
                </button>
              )}
              {(open || compact) && (
                <ul className="mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={compact ? item.label : undefined}
                          aria-current={active ? "page" : undefined}
                          className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                            active ? "bg-admin-nav-hover text-white" : "hover:bg-admin-nav-hover hover:text-white"
                          } ${compact ? "justify-center" : ""}`}
                        >
                          {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-admin-primary" />}
                          <Icon className={`h-4 w-4 shrink-0 ${active ? "text-admin-primary" : ""}`} />
                          {!compact && <span className="flex-1 truncate">{item.label}</span>}
                          {!!item.badge && (
                            <span
                              className={`rounded-full bg-admin-primary px-1.5 text-[10px] font-bold leading-4 text-white ${
                                compact ? "absolute right-1 top-1" : ""
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden border-t border-white/5 p-3 lg:block">
        <button
          type="button"
          onClick={toggleCollapsed}
          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-admin-nav-hover hover:text-white ${
            compact ? "justify-center" : ""
          }`}
          aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft className={`h-4 w-4 transition-transform ${compact ? "rotate-180" : ""}`} />
          {!compact && "Collapse"}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {sidebar(collapsed)}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-72 shadow-2xl">
            {sidebar(false)}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-admin-nav-text hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={user} onMenu={() => setMobileOpen(true)} />
        <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-admin-border px-4 py-4 text-xs text-admin-muted sm:px-6 lg:px-8">
          Life Helpers Initiative · Content Manager
        </footer>
      </div>
    </div>
  );
}

function TopBar({ user, onMenu }: { user: PublicUser; onMenu: () => void }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-admin-border bg-admin-card/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form
        role="search"
        className="relative hidden max-w-md flex-1 sm:block"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q");
          if (q) router.push(`/admin/search?q=${encodeURIComponent(String(q))}`);
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
        <input
          name="q"
          type="search"
          placeholder="Search posts, interventions, partners…"
          aria-label="Search content"
          className="w-full rounded-full border border-admin-border bg-admin-bg py-2 pl-9 pr-4 text-sm outline-none placeholder:text-admin-muted focus:border-admin-primary"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-admin-muted hover:bg-admin-bg hover:text-admin-text sm:inline-flex"
        >
          <ExternalLink className="h-4 w-4" /> View site
        </Link>
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg hover:text-admin-text"
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-admin-bg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-primary text-xs font-bold text-white">
              {initials}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-admin-muted" />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-lg"
            >
              <div className="border-b border-admin-border px-4 py-3">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-admin-muted">{user.email}</p>
                <span className="mt-1.5 inline-block rounded-full bg-admin-primary-soft px-2 py-0.5 text-[10px] font-semibold text-admin-primary">
                  {user.roleName}
                </span>
              </div>
              <Link
                href="/admin/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-admin-bg"
              >
                <UserCircle className="h-4 w-4 text-admin-muted" /> Profile & password
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-admin-danger hover:bg-admin-bg"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
