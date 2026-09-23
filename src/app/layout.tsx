import { Suspense } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Sora } from "next/font/google";
import "./globals.css";

import { EmergencyAlertBanner } from "@/components/emergency-alert-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicChrome } from "@/components/public-chrome";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-context";
import { BokehBackground } from "@/components/effects/bokeh-background";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { LocaleProvider } from "@/i18n/locale-context";
import { GoogleTranslateBridge } from "@/components/google-translate-bridge";
import { activeAlerts } from "@/config/alerts";
import { siteConfig } from "@/config/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Life Helpers Initiative | Humanitarian Relief & Sustainable Development",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Life Helpers Initiative",
    "LHI Nigeria",
    "Humanitarian Relief Nigeria",
    "NGO Sokoto",
    "Tom Brown Nutrition",
    "NIDAKE Reusable Pads",
    "VSLA Microfinance Nigeria",
    "Child Safeguarding Nigeria",
    "Clean Water Boreholes Sokoto",
    "Displacement Response Northern Nigeria",
  ],
  authors: [{ name: "Life Helpers Initiative", url: siteConfig.url }],
  creator: "Life Helpers Initiative",
  publisher: "Life Helpers Initiative",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    title: "Life Helpers Initiative | Humanitarian Relief & Sustainable Development",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/logo.png",
        width: 1533,
        height: 440,
        alt: "Life Helpers Initiative (LHI) Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Helpers Initiative | Humanitarian Relief & Sustainable Development",
    description: siteConfig.description,
    images: ["/logo.png"],
    creator: "@lhinigeria",
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  foundingDate: siteConfig.foundingDate,
  areaServed: "NG",
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  address: {
    "@type": "PostalAddress",
    ...siteConfig.address,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('error',function(e){if(e&&(e.error?.name==='ChunkLoadError'||(e.message&&e.message.indexOf('Loading chunk')!==-1))){var l=sessionStorage.getItem('chunk_reload');var n=Date.now();if(!l||n-Number(l)>10000){sessionStorage.setItem('chunk_reload',String(n));window.location.reload();}}});`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <ThemeProvider>
          <AccessibilityProvider>
            <LocaleProvider>
              <GoogleTranslateBridge />
              <PublicChrome>
                <BokehBackground />
              </PublicChrome>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Skip to content
              </a>
              <PublicChrome>
                <EmergencyAlertBanner alerts={activeAlerts} />
                <SiteHeader />
              </PublicChrome>
              <Suspense fallback={null}>
                <GoogleAnalytics />
              </Suspense>
              {children}
              <PublicChrome>
                <SiteFooter />
                <FloatingWhatsApp />
              </PublicChrome>
            </LocaleProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
