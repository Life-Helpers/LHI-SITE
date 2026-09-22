"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FastForward,
  Headphones,
  Languages,
  Mic,
  Pause,
  PhoneCall,
  Play,
  Radio,
  Rewind,
  RotateCcw,
  Search,
  Share2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import {
  BROADCAST_STATIONS,
  RADIO_EPISODES,
  type RadioEpisode,
} from "@/data/radio-episodes";
import { radioAudioEngine } from "@/components/audio/audio-synthesizer";

export function WomenSituationRoomPlayer() {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedThematic, setSelectedThematic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTranscriptId, setExpandedTranscriptId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentEpisode: RadioEpisode = RADIO_EPISODES[currentEpisodeIndex] || RADIO_EPISODES[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer progression
  useEffect(() => {
    if (isPlaying) {
      radioAudioEngine.setVolume(isMuted ? 0 : volume);
      radioAudioEngine.startAmbientBroadcast();

      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentEpisode.durationSeconds) {
            setIsPlaying(false);
            radioAudioEngine.stopAmbientBroadcast();
            return 0;
          }
          return prev + 1 * playbackRate;
        });
      }, 1000 / playbackRate);
    } else {
      radioAudioEngine.stopAmbientBroadcast();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      radioAudioEngine.stopAmbientBroadcast();
    };
  }, [isPlaying, playbackRate, currentEpisode.durationSeconds, isMuted, volume]);

  // Volume change sync
  useEffect(() => {
    radioAudioEngine.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Play / Pause toggle
  const togglePlay = (index?: number) => {
    if (index !== undefined && index !== currentEpisodeIndex) {
      setCurrentEpisodeIndex(index);
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  // Next / Prev episode
  const handleNext = () => {
    const nextIdx = (currentEpisodeIndex + 1) % RADIO_EPISODES.length;
    setCurrentEpisodeIndex(nextIdx);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    const prevIdx =
      (currentEpisodeIndex - 1 + RADIO_EPISODES.length) % RADIO_EPISODES.length;
    setCurrentEpisodeIndex(prevIdx);
    setCurrentTime(0);
  };

  const skipSeconds = (seconds: number) => {
    setCurrentTime((prev) => {
      const next = prev + seconds;
      return Math.max(0, Math.min(currentEpisode.durationSeconds, next));
    });
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Filter episodes
  const filteredEpisodes = useMemo(() => {
    return RADIO_EPISODES.filter((ep) => {
      if (selectedLanguage !== "all") {
        if (!ep.language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
          return false;
        }
      }
      if (selectedThematic !== "all" && ep.thematicArea !== selectedThematic) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ep.title.toLowerCase().includes(q) ||
          ep.subtitle.toLowerCase().includes(q) ||
          ep.summary.toLowerCase().includes(q) ||
          ep.host.toLowerCase().includes(q) ||
          ep.guests.some((g) => g.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedLanguage, selectedThematic, searchQuery]);

  const handleShare = (ep: RadioEpisode) => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/radio#${ep.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  return (
    <div className="space-y-12">
      {/* Active Featured Audio Player Console */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* Episode Visual Artwork & Live Broadcast Badge */}
          <div className="relative mx-auto aspect-square w-48 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted shadow-md sm:w-56 lg:mx-0">
            <Image
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80"
              alt="Women Situation Room Live Studio Broadcast"
              fill
              sizes="224px"
              referrerPolicy="no-referrer"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Live Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-md">
              <span className={`h-2 w-2 rounded-full bg-white ${isPlaying ? "animate-ping" : ""}`} />
              <span>{isPlaying ? "ON AIR" : "AUDIO HUB"}</span>
            </div>

            {/* Equalizer Bars (animated while playing) */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-1 h-6">
              {[40, 75, 100, 55, 90, 60, 85, 45, 95, 70].map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-primary transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 1.2)) % 100)}%` : "20%",
                    opacity: isPlaying ? 0.9 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Episode Player Metadata & Controls */}
          <div className="flex flex-1 flex-col justify-between space-y-4">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                  EPISODE {currentEpisode.episodeNumber}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  <Languages size={12} className="text-primary" />
                  <span>{currentEpisode.language}</span>
                </span>
                <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  {currentEpisode.thematicLabel}
                </span>
              </div>

              <span className="text-[11px] text-muted-foreground">
                Aired: {currentEpisode.broadcastDate}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h3 className="font-serif-display text-xl font-bold text-foreground sm:text-2xl">
                {currentEpisode.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {currentEpisode.subtitle}
              </p>
            </div>

            {/* Host & Station Citation */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-y border-border/60 py-2">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Mic size={13} className="text-primary" />
                <span>Host: {currentEpisode.host}</span>
              </div>
              <span className="text-border">&bull;</span>
              <div className="flex items-center gap-1">
                <Radio size={12} className="text-primary" />
                <span>Syndicated on: {currentEpisode.stations[0]}</span>
              </div>
            </div>

            {/* Scrubber / Progress Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={currentEpisode.durationSeconds}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary focus:outline-none"
                  aria-label="Seek time in episode"
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span className="flex items-center gap-1 text-primary font-sans font-semibold">
                  <Headphones size={12} />
                  <span>Interactive Audio Preview</span>
                </span>
                <span>{formatTime(currentEpisode.durationSeconds)}</span>
              </div>
            </div>

            {/* Primary Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              {/* Skip & Transport Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
                  title="Previous Episode"
                  aria-label="Previous Episode"
                >
                  <Rewind size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => skipSeconds(-15)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
                  title="Rewind 15 seconds"
                  aria-label="Rewind 15 seconds"
                >
                  <RotateCcw size={15} />
                </button>

                {/* Big Main Play/Pause Button */}
                <button
                  type="button"
                  onClick={() => togglePlay()}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-all"
                  aria-label={isPlaying ? "Pause Broadcast" : "Play Broadcast"}
                >
                  {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => skipSeconds(15)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
                  title="Forward 15 seconds"
                  aria-label="Forward 15 seconds"
                >
                  <FastForward size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
                  title="Next Episode"
                  aria-label="Next Episode"
                >
                  <FastForward size={16} />
                </button>
              </div>

              {/* Speed & Volume Controls */}
              <div className="flex items-center gap-3">
                {/* Speed Toggle */}
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 text-xs">
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPlaybackRate(rate)}
                      className={`rounded-lg px-2 py-0.5 text-[11px] font-bold transition-all ${
                        playbackRate === rate
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Volume Slider */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1.5 cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                    aria-label="Adjust Volume"
                  />
                </div>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => handleShare(currentEpisode)}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  title="Share Episode"
                >
                  <Share2 size={13} className="text-primary" />
                  <span>{copiedLink ? "Copied!" : "Share"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for All Broadcasts */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Radio size={14} />
              <span>Broadcast Archives · Hausa, Kanuri &amp; English</span>
            </span>
            <h3 className="font-serif-display text-xl font-bold text-foreground sm:text-2xl mt-0.5">
              Weekly Radio Broadcast Episodes
            </h3>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search episodes, topics, or guests..."
              className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Language & Theme Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border pt-4">
          <span className="text-xs text-muted-foreground mr-1">Language:</span>
          {[
            { id: "all", label: "All Languages" },
            { id: "hausa", label: "Hausa (Harshen Hausa)" },
            { id: "kanuri", label: "Kanuri (Kànurí)" },
            { id: "english", label: "English" },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLanguage(lang.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedLanguage === lang.id
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang.label}
            </button>
          ))}

          <span className="text-xs text-muted-foreground mx-2 hidden md:inline">|</span>

          <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">Theme:</span>
          {[
            { id: "all", label: "All Topics" },
            { id: "health", label: "Health & Nutrition" },
            { id: "protection", label: "Protection & SGBV" },
            { id: "education", label: "Girls' Education" },
            { id: "social-inclusion", label: "Peacebuilding" },
          ].map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedThematic(theme.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedThematic === theme.id
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Episodes Playlist Grid */}
      <div className="space-y-4">
        {filteredEpisodes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Radio className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <h4 className="mt-3 text-sm font-bold text-foreground">No broadcast episodes match</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your language or topic filter, or clear your search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage("all");
                setSelectedThematic("all");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEpisodes.map((ep) => {
            const isCurrent = currentEpisode.id === ep.id;
            const isThisPlaying = isCurrent && isPlaying;
            const isExpanded = expandedTranscriptId === ep.id;
            const episodeIdx = RADIO_EPISODES.findIndex((item) => item.id === ep.id);

            return (
              <div
                key={ep.id}
                id={ep.id}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/40 shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                  {/* Left: Play button and Titles */}
                  <div className="flex items-start sm:items-center gap-4">
                    <button
                      type="button"
                      onClick={() => togglePlay(episodeIdx)}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all ${
                        isThisPlaying
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                      aria-label={isThisPlaying ? `Pause ${ep.title}` : `Play ${ep.title}`}
                    >
                      {isThisPlaying ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} className="ml-0.5" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="font-bold text-primary">EPISODE {ep.episodeNumber}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
                          {ep.language}
                        </span>
                        <span className="text-muted-foreground">{ep.thematicLabel}</span>
                        <span className="text-muted-foreground">&bull; {ep.duration}</span>
                      </div>

                      <h4 className="mt-1 font-serif-display text-base font-bold text-foreground sm:text-lg">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ep.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Transcript Drawer Toggle & Share */}
                  <div className="flex items-center gap-2 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTranscriptId(isExpanded ? null : ep.id)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                    >
                      <BookOpen size={13} className="text-primary" />
                      <span>{isExpanded ? "Hide Details" : "Transcript & Notes"}</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(ep)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
                      title="Copy Episode Link"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expandable Transcript, Key Highlights, & Emergency Helpline Drawer */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
                    {/* Panel Guests & Host */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-border bg-card p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                          Anchor &amp; Host
                        </span>
                        <div className="font-semibold text-foreground">{ep.host}</div>
                        <div className="text-[11px] text-muted-foreground mt-1">
                          Life Helpers Initiative Media Advocacy Directorate
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-card p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                          Guest Panelists
                        </span>
                        <ul className="space-y-1 text-[11px] text-foreground">
                          {ep.guests.map((guest, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">&bull;</span>
                              <span>{guest}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Summary & Key Talking Points */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Broadcast Overview &amp; Key Takeaways
                      </h5>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {ep.summary}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-xs text-foreground">
                        {ep.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Multilingual Transcript Excerpts */}
                    <div className="space-y-2.5">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Languages size={13} className="text-primary" />
                        <span>Featured Broadcast Transcripts</span>
                      </h5>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {ep.transcriptExcerpt.map((t, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-border bg-card p-3.5 text-xs"
                          >
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                              {t.language} Translation
                            </span>
                            <blockquote className="mt-2 text-xs italic text-muted-foreground leading-relaxed">
                              {t.text}
                            </blockquote>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Helpline Alert Banner */}
                    {ep.helpline && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3.5 text-xs">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <PhoneCall size={16} />
                          <span>{ep.helpline}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Free, confidential referral desks open Monday – Saturday (8 AM – 6 PM)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast FM Stations & Transmission Schedule */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Radio size={14} />
              <span>Syndicated Radio Network</span>
            </div>
            <h3 className="font-serif-display text-xl font-bold text-foreground sm:text-2xl mt-0.5">
              Live FM Transmission Schedules
            </h3>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm">
            Tuning in via transistor radio? Find your regional frequency below. Every episode includes live listener call-ins.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BROADCAST_STATIONS.map((station, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-border bg-muted/20 p-4 hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif-display text-base font-bold text-foreground">
                    {station.station}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    Live Call-In
                  </span>
                </div>
                <div className="mt-1 text-xs text-primary font-medium">
                  {station.schedule}
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  <strong>Languages:</strong> {station.languages}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  <strong>Coverage:</strong> {station.reach}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {station.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
