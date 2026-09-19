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
      className={cn("flex items-center", className)}
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
        "group flex items-center gap-1 rounded text-sm font-medium text-foreground/80 outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
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
      className={cn("w-full p-6 sm:w-auto", className)}
      {...props}
    />
  );
}

function NavigationMenuViewport() {
  return (
    <div className="absolute top-full left-0 flex w-full justify-center">
      <NavigationMenuPrimitive.Viewport className="relative mt-2 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg sm:w-(--radix-navigation-menu-viewport-width)" />
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
