import { siFacebook, siInstagram, siLinktree, siX, siYoutube } from "@/data/brand-icons";

import { siteConfig } from "@/config/site";

export const LINKEDIN_PATH =
  "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z";

export const SOCIAL_ACCOUNTS = [
  { name: "Facebook", handle: "lifehelpersinitiative", href: siteConfig.social.facebook, path: siFacebook.path, color: "#0866FF" },
  { name: "Instagram", handle: "@lifehelpersinitiative", href: siteConfig.social.instagram, path: siInstagram.path, color: "#E4405F" },
  { name: "X", handle: "@Lifehelperinit1", href: siteConfig.social.x, path: siX.path, color: "#000000" },
  { name: "LinkedIn", handle: "Life Helpers Initiative", href: siteConfig.social.linkedin, path: LINKEDIN_PATH, color: "#0A66C2" },
  { name: "YouTube", handle: "@LifeHelpers-Initiative", href: siteConfig.social.youtube, path: siYoutube.path, color: "#FF0000" },
  { name: "Linktree", handle: "linktr.ee/lifehelpers", href: siteConfig.social.linktree, path: siLinktree.path, color: "#43E55E" },
] as const;

export function SocialIcon({ path, className = "h-4 w-4" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d={path} />
    </svg>
  );
}

/** Row of verified LHI social media links. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {SOCIAL_ACCOUNTS.map((a) => (
        <li key={a.name}>
          <a
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Life Helpers Initiative on ${a.name}`}
            title={`${a.name}: ${a.handle}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <SocialIcon path={a.path} />
          </a>
        </li>
      ))}
    </ul>
  );
}
