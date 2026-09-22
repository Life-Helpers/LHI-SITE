"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [gaId, setGaId] = useState<string>("");

  useEffect(() => {
    // Check environment variable first, then custom admin setting
    const envId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const storedId = typeof window !== "undefined" ? localStorage.getItem("lhi_ga_measurement_id") : null;
    const activeId = envId || storedId || "G-LHI2026NG"; // Fallback identifier
    setGaId(activeId);
  }, []);

  useEffect(() => {
    if (!gaId || typeof window === "undefined" || !(window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      return;
    }
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    (window as unknown as { gtag: (command: string, targetId: string, config: object) => void }).gtag(
      "config",
      gaId,
      {
        page_path: url,
        page_title: document.title,
      }
    );
  }, [pathname, searchParams, gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
