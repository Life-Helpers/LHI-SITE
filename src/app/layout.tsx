import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Sora } from "next/font/google";
import "./globals.css";

import { EmergencyAlertBanner } from "@/components/emergency-alert-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-context";
import { BokehBackground } from "@/components/effects/bokeh-background";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { LocaleProvider } from "@/i18n/locale-context";
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
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <ThemeProvider>
          <AccessibilityProvider>
            <LocaleProvider>
              <BokehBackground />
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Skip to content
              </a>
              <EmergencyAlertBanner alerts={activeAlerts} />
              <SiteHeader />
              {children}
              <SiteFooter />
              <FloatingWhatsApp />
            </LocaleProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
