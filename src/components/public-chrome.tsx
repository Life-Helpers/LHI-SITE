"use client";

import { usePathname } from "next/navigation";

/** Renders public-site chrome (header, footer, widgets) everywhere except the admin CMS and the HR portal. */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/hrportal")) return null;
  return <>{children}</>;
}
