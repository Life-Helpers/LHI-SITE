"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Repeat,
  Share2,
  ExternalLink,
  ThumbsUp,
  Bookmark,
  CheckCircle,
} from "lucide-react";

type SocialTab = "all" | "facebook" | "x" | "instagram";

export function SocialFeedsSection() {
  const [activeTab, setActiveTab] = useState<SocialTab>("all");

  const facebookPosts = [
    {
      id: "fb-1",
      author: "Life Helpers Initiative",
      handle: "@lhinigeria.org",
      time: "2 hours ago",
      text: "Comprehensive Maternal & Child Health Outreach in Borno State! Our field health officers conducted mobile triage, infant nutrition screening (MUAC), and routine immunizations reaching over 380 mothers and children today. Every mother deserves dignified care. #HumanitarianResponse #HealthForAll #LifeHelpers",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
      likes: 184,
      comments: 32,
      shares: 19,
      url: "https://facebook.com",
    },
    {
      id: "fb-2",
      author: "Life Helpers Initiative",
      handle: "@lhinigeria.org",
      time: "Yesterday at 3:15 PM",
      text: "Water is life! Commissioning of the solar-powered potable borehole in Gujba LGA, Yobe State. Over 3,500 displaced families now have daily access to clean, reliable water — significantly reducing incidences of cholera and waterborne infections.",
      image: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
      likes: 245,
      comments: 48,
      shares: 41,
      url: "https://facebook.com",
    },
  ];

  const xPosts = [
    {
      id: "x-1",
      author: "Life Helpers Initiative",
      handle: "@lhinigeria",
      time: "3h",
      text: "Zero tolerance for SEA! Our PSEA safeguarding officers held community feedback & complaint mechanism (CFM) sessions across 4 settlement hubs today. Confidentiality and accountability to affected populations remain paramount. Report anytime: psea@lhinigeria.org #PSEA #Protection",
      retweets: 28,
      likes: 114,
      replies: 12,
      url: "https://x.com",
    },
    {
      id: "x-2",
      author: "Life Helpers Initiative",
      handle: "@lhinigeria",
      time: "1d",
      text: "Education cannot wait. Through our Accelerated Learning Centers (ALCs) in Sokoto & Zamfara, out-of-school adolescent girls are regaining literacy, numeracy, and vocational life skills. Here's a glimpse into today's cohort. 📚✨ #GirlChildEducation",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      retweets: 45,
      likes: 196,
      replies: 18,
      url: "https://x.com",
    },
  ];

  const instagramPosts = [
    {
      id: "ig-1",
      caption: "Smiles restored! Community-based Tom Brown nutrition screening and preparation in full swing. 🥣💚 #LifeHelpersInitiative #Nutrition #EndMalnutrition",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
      likes: 312,
      comments: 24,
      url: "https://instagram.com",
    },
    {
      id: "ig-2",
      caption: "NIDAKE reusable sanitary pad production by local female artisans. Promoting dignified menstrual health while generating sustainable community livelihoods.",
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80",
      likes: 278,
      comments: 19,
      url: "https://instagram.com",
    },
    {
      id: "ig-3",
      caption: "Community peace dialogue facilitated through our Women Situation Room radio program. Amplifying grassroots female voices in conflict mediation.",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
      likes: 195,
      comments: 15,
      url: "https://instagram.com",
    },
  ];

  return (
    <section className="border-t border-border bg-muted/20 py-16 sm:py-20 dark:bg-card/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Live Social Feeds
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Follow Our Field Updates
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground">
              Real-time dispatches from our humanitarian interventions, community engagements, and beneficiaries across Nigeria.
            </p>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-1.5 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-1.5 font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Feeds
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("facebook")}
              className={`rounded-lg px-3.5 py-1.5 font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "facebook"
                  ? "bg-[#1877F2] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("x")}
              className={`rounded-lg px-3.5 py-1.5 font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "x"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>X (Twitter)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("instagram")}
              className={`rounded-lg px-3.5 py-1.5 font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "instagram"
                  ? "bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Instagram</span>
            </button>
          </div>
        </div>

        {/* Feeds Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* FACEBOOK COLUMN */}
          {(activeTab === "all" || activeTab === "facebook") && (
            <div className={`space-y-4 ${activeTab === "facebook" ? "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0" : ""}`}>
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1877F2] text-white font-bold text-xs">
                    f
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Facebook Feed</h3>
                </div>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#1877F2] hover:underline flex items-center gap-1"
                >
                  Follow <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {facebookPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-muted">
                      <Image
                        src="/logo.png"
                        alt="Life Helpers Initiative"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-foreground">{post.author}</span>
                        <CheckCircle className="h-3.5 w-3.5 text-[#1877F2] fill-[#1877F2]/10" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">{post.time}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-foreground">
                    {post.text}
                  </p>

                  {post.image && (
                    <div className="relative mt-3 h-44 w-full overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={post.image}
                        alt="Facebook update"
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 hover:text-[#1877F2] cursor-pointer">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{post.comments}</span>
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{post.shares}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* X (TWITTER) COLUMN */}
          {(activeTab === "all" || activeTab === "x") && (
            <div className={`space-y-4 ${activeTab === "x" ? "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0" : ""}`}>
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    𝕏
                  </div>
                  <h3 className="text-sm font-bold text-foreground">X (Twitter) Feed</h3>
                </div>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-foreground hover:underline flex items-center gap-1"
                >
                  Follow <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {xPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
                        <Image
                          src="/logo.png"
                          alt="Life Helpers Initiative"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-foreground">{post.author}</span>
                          <CheckCircle className="h-3.5 w-3.5 text-sky-500 fill-sky-500/10" />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{post.handle} • {post.time}</span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-muted-foreground">𝕏</span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-foreground">
                    {post.text}
                  </p>

                  {post.image && (
                    <div className="relative mt-3 h-44 w-full overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={post.image}
                        alt="X media"
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 hover:text-sky-500 cursor-pointer">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{post.replies}</span>
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-emerald-500 cursor-pointer">
                      <Repeat className="h-3.5 w-3.5" />
                      <span>{post.retweets}</span>
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer">
                      <Bookmark className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INSTAGRAM COLUMN */}
          {(activeTab === "all" || activeTab === "instagram") && (
            <div className={`space-y-4 ${activeTab === "instagram" ? "lg:col-span-3" : ""}`}>
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs">
                    📷
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Instagram Feed</h3>
                </div>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                >
                  Follow <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {instagramPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
                  >
                    <div className="relative h-48 w-full bg-muted">
                      <Image
                        src={post.image}
                        alt="Instagram photo"
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-xs leading-snug line-clamp-2 text-zinc-100">
                          {post.caption}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-[11px] text-zinc-300">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
