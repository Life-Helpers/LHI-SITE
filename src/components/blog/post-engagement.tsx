"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Heart, Link2, Loader2, Mail, MessageCircle, Share2 } from "lucide-react";
import { siFacebook, siPinterest, siReddit, siTelegram, siWhatsapp, siX } from "simple-icons";

import { LINKEDIN_PATH, SocialIcon } from "@/components/social-links";
import { Turnstile, turnstileHeaders } from "@/components/forms/turnstile";

type Comment = { id: string; name: string; body: string; createdAt: string };

const LIKED_KEY = "lhi_liked_posts";

function readLiked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeLiked(list: string[]) {
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: the like still counts, it just isn't remembered */
  }
}

function shareTargets(url: string, title: string, image?: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { name: "Facebook", path: siFacebook.path, color: "#0866FF", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "X", path: siX.path, color: "#000000", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { name: "LinkedIn", path: LINKEDIN_PATH, color: "#0A66C2", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "WhatsApp", path: siWhatsapp.path, color: "#25D366", href: `https://wa.me/?text=${t}%20${u}` },
    { name: "Telegram", path: siTelegram.path, color: "#26A5E4", href: `https://t.me/share/url?url=${u}&text=${t}` },
    { name: "Reddit", path: siReddit.path, color: "#FF4500", href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
    {
      name: "Pinterest",
      path: siPinterest.path,
      color: "#BD081C",
      href: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}${image ? `&media=${encodeURIComponent(image)}` : ""}`,
    },
  ];
}

export function PostEngagement({ slug, title, url, image }: { slug: string; title: string; url: string; image?: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [approvedNow, setApprovedNow] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, { cache: "no-store" }).catch(() => null);
    if (!res?.ok) return;
    const data = await res.json();
    setLikes(data.likes);
    setComments(data.comments);
  }, [slug]);

  useEffect(() => {
    setLiked(readLiked().includes(slug));
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    load();
  }, [slug, load]);

  async function toggleLike() {
    const next = !liked;
    setLiked(next);
    setLikes((n) => Math.max(0, (n ?? 0) + (next ? 1 : -1)));
    const list = readLiked().filter((s) => s !== slug);
    writeLiked(next ? [...list, slug] : list);
    const res = await fetch(`/api/posts/${encodeURIComponent(slug)}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liked: next }),
    }).catch(() => null);
    if (res?.ok) setLikes((await res.json()).likes);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  async function submitComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const website = (new FormData(e.currentTarget).get("website") as string) || undefined;
    const res = await fetch(`/api/posts/${encodeURIComponent(slug)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...turnstileHeaders(e.currentTarget) },
      body: JSON.stringify({ name, email, body, website }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok) {
      setError(data?.error || "Could not post your comment. Please try again.");
      setStatus("idle");
      return;
    }
    setBody("");
    setStatus("sent");
    if (data?.approved) {
      setApprovedNow(true);
      load();
    }
  }

  const input =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";

  return (
    <section aria-label="Like, share and comment" className="mt-12 space-y-10 border-t border-border pt-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              liked ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} aria-hidden="true" />
            {liked ? "Liked" : "Like"}
            <span className="tabular-nums">{likes ?? "–"}</span>
          </button>
          <a href="#comments" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> {comments.length}
            <span className="sr-only">comments</span>
          </a>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Share this story</p>
          <ul className="flex flex-wrap gap-2">
            {canNativeShare && (
              <li>
                <button
                  type="button"
                  onClick={() => navigator.share({ title, url }).catch(() => undefined)}
                  aria-label="Share with an app (Instagram, TikTok and more)"
                  title="Share with an app"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </li>
            )}
            {shareTargets(url, title, image).map((t) => (
              <li key={t.name}>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${t.name}`}
                  title={`Share on ${t.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                  style={{ backgroundColor: t.color }}
                >
                  <SocialIcon path={t.path} className="h-4 w-4" />
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`}
                aria-label="Share by email"
                title="Share by email"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/70"
              >
                <Mail className="h-4 w-4" />
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={copyLink}
                aria-label={copied ? "Link copied" : "Copy link (for Instagram, TikTok and others)"}
                title={copied ? "Link copied" : "Copy link"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/70"
              >
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div id="comments" className="scroll-mt-28">
        <h2 className="font-serif-display text-2xl font-light text-foreground">
          Comments {comments.length > 0 && <span className="text-muted-foreground">({comments.length})</span>}
        </h2>
        {comments.length > 0 ? (
          <ul className="mt-5 space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{c.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts.</p>
        )}

        {status === "sent" ? (
          <p role="status" className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
            {approvedNow ? "Thank you! Your comment has been posted." : "Thank you! Your comment has been received and will appear once it has been reviewed."}
          </p>
        ) : (
          <form onSubmit={submitComment} className="relative mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">Leave a comment</p>
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="sr-only">Name</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" maxLength={80} className={input} />
              </label>
              <label className="text-sm">
                <span className="sr-only">Email (not published)</span>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (not published)" autoComplete="email" className={input} />
              </label>
            </div>
            <label className="block text-sm">
              <span className="sr-only">Comment</span>
              <textarea required value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={2000} placeholder="Write your comment…" className={input} />
            </label>
            <Turnstile />
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Please keep comments respectful. <Link href="/terms#user-content" className="underline">Comment guidelines</Link></p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} Post comment
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
