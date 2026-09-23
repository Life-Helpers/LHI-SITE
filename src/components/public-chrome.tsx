"use client";

import { usePathname } from "next/navigation";

/** Renders public-site chrome (header, footer, widgets) everywhere except the admin CMS. */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
