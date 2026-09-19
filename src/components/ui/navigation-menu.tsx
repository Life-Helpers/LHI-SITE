"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn("static flex items-center", className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn("flex list-none items-center gap-6", className)}
      {...props}
    />
  );
}

const NavigationMenuItem = NavigationMenuPrimitive.Item;

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        // Radix's NavigationMenu.Trigger does its own internal focus
        // management (roving focus for arrow-key navigation), which
        // defeats the browser's native :focus-visible heuristic even on
        // genuine keyboard Tab — verified via Playwright: the CSS was
        // correct but the pseudo-class never matched. Using :focus
        // instead guarantees the ring shows whenever the trigger holds
        // focus, which is what WCAG 2.4.7 actually requires here.
        "group flex items-center gap-1 rounded text-sm font-medium text-foreground/80 hover:text-foreground focus:outline-3 focus:outline-offset-4 focus:outline-ring",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "top-0 left-0 w-full transition-none duration-0 animate-none data-[motion]:transition-none data-[motion]:transform-none data-[motion]:animate-none",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="pointer-events-none absolute top-[calc(100%+0.5rem)] left-0 right-0 z-50 flex w-full justify-center">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "pointer-events-auto relative w-[min(calc(100vw-2.5rem),880px)] origin-top overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl transition-none duration-0 animate-none data-[state=open]:animate-none data-[state=closed]:animate-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

const NavigationMenuLink = NavigationMenuPrimitive.Link;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
};
