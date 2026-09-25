import { ExternalLink } from "lucide-react";

import { SocialWall } from "@/components/home/social-wall";
import { SOCIAL_ACCOUNTS, SocialIcon } from "@/components/social-links";
import { siteConfig } from "@/config/site";
import { getSocialFeed } from "@/lib/social-feed";

/**
 * "Follow our work": a live social media newsroom. The phone on the left streams the
 * official Facebook Page timeline (Meta's page plugin, always live). The wall on the right
 * shows the newest posts from every connected account (see src/lib/social-feed.ts), and falls
 * back to follow cards for each channel until an account is connected.
 */
export async function SocialFeedsSection() {
  const { items } = await getSocialFeed(10);
  const fbPlugin = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    siteConfig.social.facebook,
  )}&tabs=timeline&width=340&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  return (
    <section aria-labelledby="social-heading" className="relative isolate overflow-hidden bg-[#140809] py-20 text-white sm:py-28">
      {/* Signal glow and grid */}
      <div aria-hidden="true" className="absolute -left-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-primary/35 blur-[140px]" />
      <div aria-hidden="true" className="absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[140px]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">— Follow our work</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Live feed
              </span>
            </div>
            <h2 id="social-heading" className="mt-3 font-serif-display text-4xl font-light leading-tight sm:text-5xl">
              Life Helpers Initiative <em className="italic text-[#ff8a7a]">on social media</em>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Field updates, stories and events as they happen, straight from our official accounts. What we post appears here.
            </p>
          </div>

          {/* Channel dial */}
          <ul aria-label="Our social media accounts" className="flex flex-wrap gap-2.5">
            {SOCIAL_ACCOUNTS.map((a) => (
              <li key={a.name}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${a.name}: ${a.handle}`}
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent"
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

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Phone streaming the live Facebook timeline */}
          <div className="lg:col-span-4">
            <div className="relative mx-auto w-full max-w-[360px] rounded-[2.75rem] border border-white/15 bg-gradient-to-b from-white/15 to-white/5 p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
              <div aria-hidden="true" className="absolute left-1/2 top-4 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
              <div className="overflow-hidden rounded-[2.2rem] bg-white">
                <div className="flex items-center justify-between bg-[#0866FF] px-5 pb-3 pt-10 text-white">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <SocialIcon path={SOCIAL_ACCOUNTS[0].path} className="h-4 w-4" /> Live on Facebook
                  </span>
                  <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold hover:underline">
                    Open <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">Facebook page (opens in a new tab)</span>
                  </a>
                </div>
                <iframe
                  src={fbPlugin}
                  title="Life Helpers Initiative Facebook timeline"
                  loading="lazy"
                  className="h-[560px] w-full border-0 bg-white"
                  allow="encrypted-media; picture-in-picture; web-share"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {items.length > 0 ? (
              <SocialWall items={items} />
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SOCIAL_ACCOUNTS.filter((a) => a.name !== "Facebook").map((a, i) => (
                  <li key={a.name} className={i === 0 ? "sm:col-span-2" : ""}>
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                        style={{ backgroundColor: a.color === "#000000" ? "#ffffff" : a.color }}
                      />
                      <SocialIcon path={a.path} className="absolute -bottom-6 -right-4 h-32 w-32 text-white/[0.06]" />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: a.color }}>
                        <SocialIcon path={a.path} className="h-5 w-5" />
                      </span>
                      <span className="relative mt-6">
                        <span className="block font-serif-display text-2xl font-light">{a.name}</span>
                        <span className="block text-sm text-white/65">{a.handle}</span>
                      </span>
                      <span className="relative mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">
                        {a.name === "Linktree" ? "All our links" : a.name === "YouTube" ? "Watch" : "Follow"} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
