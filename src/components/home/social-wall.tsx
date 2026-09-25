"use client";

import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

import { SOCIAL_ACCOUNTS, SocialIcon } from "@/components/social-links";
import type { SocialItem, SocialNetwork } from "@/lib/social-feed";

const ACCOUNT: Record<SocialNetwork, (typeof SOCIAL_ACCOUNTS)[number]> = {
  facebook: SOCIAL_ACCOUNTS.find((a) => a.name === "Facebook")!,
  instagram: SOCIAL_ACCOUNTS.find((a) => a.name === "Instagram")!,
  youtube: SOCIAL_ACCOUNTS.find((a) => a.name === "YouTube")!,
  x: SOCIAL_ACCOUNTS.find((a) => a.name === "X")!,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Date in Lagos time (UTC+1), formatted the same on the server and in the browser. */
const when = (iso: string) => {
  const d = new Date(Date.parse(iso) + 3_600_000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** Filterable masonry wall of recent social posts. */
export function SocialWall({ items }: { items: SocialItem[] }) {
  const networks = [...new Set(items.map((i) => i.network))];
  const [filter, setFilter] = useState<SocialNetwork | "all">("all");
  const shown = filter === "all" ? items : items.filter((i) => i.network === filter);

  return (
    <div>
      {networks.length > 1 && (
        <div role="group" aria-label="Filter posts by network" className="mb-5 flex flex-wrap gap-2">
          {(["all", ...networks] as const).map((n) => {
            const on = filter === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(n)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  on ? "border-white bg-white text-[#1a0a0b]" : "border-white/20 text-white/80 hover:border-white/50 hover:text-white"
                }`}
              >
                {n !== "all" && <SocialIcon path={ACCOUNT[n].path} className="h-3.5 w-3.5" />}
                {n === "all" ? "All" : ACCOUNT[n].name}
                <span className={on ? "text-[#1a0a0b]/60" : "text-white/50"}>{n === "all" ? items.length : items.filter((i) => i.network === n).length}</span>
              </button>
            );
          })}
        </div>
      )}

      <ul className="columns-1 gap-4 sm:columns-2 [&>li]:mb-4">
        {shown.map((item) => {
          const a = ACCOUNT[item.network];
          return (
            <li key={item.id} className="break-inside-avoid">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.09]"
              >
                <div className="h-1" style={{ backgroundColor: a.color === "#000000" ? "#ffffff" : a.color }} aria-hidden="true" />
                <div className="flex items-center gap-3 px-4 pt-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ring-2 ring-white/10"
                    style={{ backgroundColor: a.color }}
                  >
                    <SocialIcon path={a.path} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">Life Helpers Initiative</span>
                    <span className="block truncate text-xs text-white/60">
                      {a.handle} · <time dateTime={item.date}>{when(item.date)}</time>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" aria-hidden="true" />
                </div>
                {item.text && <p className="line-clamp-5 whitespace-pre-line px-4 pt-3 text-sm leading-relaxed text-white/85">{item.text}</p>}
                {item.image && (
                  <div className="relative mx-4 mt-3 overflow-hidden rounded-xl bg-black/30">
                    {/* Social CDN images change address often, so they are shown as-is rather than through next/image. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    {item.video && (
                      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
                          <Play className="h-5 w-5 fill-current" />
                        </span>
                      </span>
                    )}
                  </div>
                )}
                <p className="px-4 pb-4 pt-3 text-[11px] font-semibold uppercase tracking-widest text-white/50 group-hover:text-white/80">
                  View on {a.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
