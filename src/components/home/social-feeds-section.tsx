import type { ReactNode } from "react";
import { ExternalLink, Play } from "lucide-react";

import { SOCIAL_ACCOUNTS, SocialIcon, socialAccounts } from "@/components/social-links";
import { getSettings, getSiteData } from "@/lib/cms/content";
import { linkedinEmbed } from "@/lib/linkedin";
import { chosenVideos, youtubeItems } from "@/lib/social-feed";
import { youtubeId } from "@/lib/youtube";

const brand = (name: string) => SOCIAL_ACCOUNTS.find((a) => a.name === name)!;

/** One network's feed: a header in the network's colour with a link to the account, then the feed itself. */
function FeedPanel({ name, label, href, children }: { name: string; label: string; href: string; children: ReactNode }) {
  const a = brand(name);
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 text-white" style={{ backgroundColor: a.color }}>
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <SocialIcon path={a.path} className="h-4 w-4" /> {label}
        </span>
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold hover:underline">
          Open <ExternalLink className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">{name} (opens in a new tab)</span>
        </a>
      </div>
      <div className="h-[560px] overflow-y-auto">{children}</div>
    </div>
  );
}

/**
 * "Follow our work": three live feeds side by side. Facebook streams the Page timeline (Meta's page
 * plugin; can be switched off in Admin → Site Settings), YouTube plays the newest video (or the first one
 * chosen in Site Settings) with more listed under it, and LinkedIn shows the posts chosen in Site Settings,
 * because LinkedIn has no free live feed of a company page.
 */
export async function SocialFeedsSection() {
  const { socialPhone } = await getSettings();
  const showFacebook = socialPhone.facebook;
  const [{ social }, picked, latest] = await Promise.all([getSiteData(), chosenVideos(socialPhone.videos), youtubeItems(5)]);
  const videos = [...picked, ...latest.filter((i) => !picked.some((p) => p.id === i.id))].slice(0, 5);
  const [first, ...more] = videos;
  const firstId = first ? youtubeId(first.url) : null;
  const linkedinPosts = (socialPhone.linkedin ?? "").split("\n").map(linkedinEmbed).filter((u): u is string => Boolean(u));
  const accounts = socialAccounts(social);
  const fbPlugin = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    social.facebook,
  )}&tabs=timeline&width=500&height=560&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  return (
    <section aria-labelledby="social-heading" className="border-t border-border/60 bg-background py-20 text-foreground sm:py-28">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Follow our work</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Live feed
              </span>
            </div>
            <h2 id="social-heading" className="mt-3 font-serif-display text-4xl font-light leading-tight sm:text-5xl">
              Life Helpers Initiative <em className="italic text-primary">on social media</em>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Field updates, stories and events as they happen, straight from our official accounts. What we post appears here.
            </p>
          </div>

          {/* Channel dial */}
          <ul aria-label="Our social media accounts" className="flex flex-wrap gap-2.5">
            {accounts.map((a) => (
              <li key={a.name}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${a.name}: ${a.handle}`}
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:text-white"
                  style={{ ["--brand" as string]: a.color === "#000000" ? "#2b2b2b" : a.color }}
                >
                  <span className="sr-only">Life Helpers Initiative on {a.name} (opens in a new tab)</span>
                  <span className="flex h-full w-full items-center justify-center rounded-2xl transition-colors group-hover:bg-[var(--brand)]">
                    <SocialIcon path={a.path} className="h-5 w-5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={`mt-12 grid grid-cols-1 gap-6 ${showFacebook ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {showFacebook && (
            <FeedPanel name="Facebook" label="Live on Facebook" href={social.facebook}>
              <iframe
                src={fbPlugin}
                title="Life Helpers Initiative Facebook timeline"
                loading="lazy"
                className="h-full w-full border-0 bg-white"
                allow="encrypted-media; picture-in-picture; web-share"
              />
            </FeedPanel>
          )}

          <FeedPanel name="YouTube" label="Latest on YouTube" href={social.youtube}>
            {firstId ? (
              <div className="space-y-4 p-4">
                <div className="aspect-video overflow-hidden rounded-xl bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${firstId}`}
                    title={first.text}
                    loading="lazy"
                    className="h-full w-full border-0"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="text-sm font-semibold leading-snug">{first.text}</p>
                {more.length > 0 && (
                  <ul className="space-y-3 border-t border-border pt-4" aria-label="More videos">
                    {more.map((v) => (
                      <li key={v.id}>
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                          <span className="relative w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={v.image} alt="" loading="lazy" className="aspect-video w-full object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                              <Play className="h-5 w-5 fill-white text-white drop-shadow" />
                            </span>
                          </span>
                          <span className="line-clamp-3 text-sm leading-snug text-foreground/85 group-hover:text-foreground group-hover:underline">
                            {v.text}
                            <span className="sr-only"> (opens YouTube in a new tab)</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <FollowCard name="YouTube" href={social.youtube} action="Watch our videos" />
            )}
          </FeedPanel>

          <FeedPanel name="LinkedIn" label="On LinkedIn" href={social.linkedin}>
            {linkedinPosts.length > 0 ? (
              <ul className="space-y-4 bg-muted/40 p-4">
                {linkedinPosts.map((src, i) => (
                  <li key={src} className="overflow-hidden rounded-xl bg-white">
                    <iframe src={src} title={`Life Helpers Initiative LinkedIn post ${i + 1}`} loading="lazy" className="h-[520px] w-full border-0" />
                  </li>
                ))}
              </ul>
            ) : (
              <FollowCard name="LinkedIn" href={social.linkedin} action="Follow us on LinkedIn" />
            )}
          </FeedPanel>
        </div>
      </div>
    </section>
  );
}

/** Shown in a panel when it has nothing to play yet: the account, and a link to follow it. */
function FollowCard({ name, href, action }: { name: string; href: string; action: string }) {
  const a = brand(name);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: a.color }}>
        <SocialIcon path={a.path} className="h-7 w-7" />
      </span>
      <span>
        <span className="block font-serif-display text-2xl font-light">Life Helpers Initiative</span>
        <span className="block text-sm text-muted-foreground">{a.handle}</span>
      </span>
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
        {action} <ExternalLink className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </span>
    </a>
  );
}
