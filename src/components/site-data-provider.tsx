"use client";

import { createContext, useContext } from "react";

import { DEFAULT_SITE_DATA, type SiteData } from "@/lib/site-data";

const SiteDataContext = createContext<SiteData>(DEFAULT_SITE_DATA);

/** Makes the CMS-managed contact details, social accounts and impact figures available to client components. */
export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
