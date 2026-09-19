"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  impactLinks,
  whatWeDoCards,
  whatWeDoExtra,
  whoWeAreLinks,
  type NavLink,
} from "@/components/nav-data";

const simpleLinks: NavLink[] = [
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

function DropdownPanel({ links }: { links: NavLink[] }) {
  return (
    <ul className="grid w-56 gap-1">
      {links.map((link) => (
        <li key={link.href}>
          <NavigationMenuLink asChild>
            <Link
              href={link.href}
              className="block rounded px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

function WhatWeDoPanel() {
  return (
    <div className="w-[min(90vw,720px)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {whatWeDoCards.map((card) => (
          <NavigationMenuLink asChild key={card.href}>
            <Link
              href={card.href}
              className="group flex flex-col overflow-hidden rounded-md border border-border hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex h-20 items-center justify-center bg-gradient-to-br from-primary to-accent">
                <card.icon
                  className="h-8 w-8 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold group-hover:text-primary">
                  {card.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </Link>
          </NavigationMenuLink>
        ))}
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <NavigationMenuLink asChild>
          <Link
            href={whatWeDoExtra.href}
            className="inline-block rounded px-1 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {whatWeDoExtra.label} →
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

function MobileDisclosure({
  label,
  links,
  onNavigate,
}: {
  label: string;
  links: NavLink[];
  onNavigate: () => void;
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
        {label}
        <span aria-hidden="true" className="transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <ul className="mt-1 mb-2 flex flex-col gap-0.5 pl-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="block rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative border-b border-border">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6"
      >
        <Link
          href="/"
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src="/logo.png"
            alt="Life Helpers Initiative"
            width={1533}
            height={440}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="rounded text-sm font-medium text-foreground/80 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Who We Are</NavigationMenuTrigger>
              <NavigationMenuContent>
                <DropdownPanel links={whoWeAreLinks} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>What We Do</NavigationMenuTrigger>
              <NavigationMenuContent>
                <WhatWeDoPanel />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Impact</NavigationMenuTrigger>
              <NavigationMenuContent>
                <DropdownPanel links={impactLinks} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {simpleLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="rounded text-sm font-medium text-foreground/80 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/donate">Donate</Link>
          </Button>

          <button
            type="button"
            className="rounded p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden"
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block rounded px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Home
          </Link>

          <MobileDisclosure
            label="Who We Are"
            links={whoWeAreLinks}
            onNavigate={() => setMenuOpen(false)}
          />
          <MobileDisclosure
            label="What We Do"
            links={[...whatWeDoCards, whatWeDoExtra]}
            onNavigate={() => setMenuOpen(false)}
          />
          <MobileDisclosure
            label="Impact"
            links={impactLinks}
            onNavigate={() => setMenuOpen(false)}
          />

          {simpleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
