"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface RadioEpisode {
  id: string;
  title: string;
  audio: string;
  summary: string;
  programme: string;
  date: string;
  language: string;
  duration: string;
  station: string;
  cover: string;
  topics: string[];
  guests: string[];
}

const VOLUME_KEY = "lhi_radio_volume";

/** One audio element driving a playlist of radio episodes. */
export function useRadio(episodes: RadioEpisode[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [error, setError] = useState("");
  const current = episodes[index];

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;
    try {
      const v = Number(localStorage.getItem(VOLUME_KEY));
      if (v > 0 && v <= 1) {
        audio.volume = v;
        setVolumeState(v);
      }
    } catch {
      /* default volume */
    }
    const on = (e: string, fn: () => void) => audio.addEventListener(e, fn);
    on("play", () => setPlaying(true));
    on("pause", () => setPlaying(false));
    on("waiting", () => setLoading(true));
    on("playing", () => setLoading(false));
    on("canplay", () => setLoading(false));
    on("timeupdate", () => setTime(audio.currentTime));
    on("loadedmetadata", () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0));
    on("error", () => {
      setLoading(false);
      setPlaying(false);
      setError("This recording could not be played.");
    });
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Load the selected episode.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.src.endsWith(current.audio)) return;
    const wasPlaying = !audio.paused;
    audio.src = current.audio;
    setTime(0);
    setDuration(0);
    setError("");
    if (wasPlaying) void audio.play().catch(() => undefined);
  }, [current]);

  // Auto-advance at the end of an episode.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      if (index < episodes.length - 1) {
        setIndex(index + 1);
        window.setTimeout(() => void audioRef.current?.play().catch(() => undefined), 50);
      }
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [index, episodes.length]);

  const play = useCallback(async (i?: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (typeof i === "number" && i !== index) {
      setIndex(i);
      const ep = episodes[i];
      if (ep) audio.src = ep.audio;
    }
    setError("");
    setLoading(true);
    try {
      await audio.play();
    } catch {
      setLoading(false);
    }
  }, [index, episodes]);

  const pause = useCallback(() => audioRef.current?.pause(), []);
  const toggle = useCallback(() => (audioRef.current?.paused ? play() : pause()), [play, pause]);
  const next = useCallback(() => episodes.length && play((index + 1) % episodes.length), [episodes.length, index, play]);
  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 5) {
      audio.currentTime = 0;
      return;
    }
    if (episodes.length) void play((index - 1 + episodes.length) % episodes.length);
  }, [episodes.length, index, play]);
  const seek = useCallback((t: number) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(t)) audio.currentTime = t;
  }, []);
  const skip = useCallback((d: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, Math.min((audio.duration || 0) - 0.5, audio.currentTime + d));
  }, []);
  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (audioRef.current) audioRef.current.volume = clamped;
    setVolumeState(clamped);
    try {
      localStorage.setItem(VOLUME_KEY, String(clamped));
    } catch {
      /* not remembered */
    }
  }, []);

  return { current, index, playing, loading, time, duration, volume, error, play, pause, toggle, next, prev, seek, skip, setVolume, select: setIndex };
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

/** Next WeSpeak broadcast: Tuesdays 11:00–12:00 West Africa Time (UTC+1). */
export function nextBroadcast(now = new Date()) {
  const wat = new Date(now.getTime() + 3600_000); // shift to WAT, read with UTC getters
  const day = wat.getUTCDay();
  const minutes = wat.getUTCHours() * 60 + wat.getUTCMinutes();
  const live = day === 2 && minutes >= 660 && minutes < 720;
  let daysAhead = (2 - day + 7) % 7;
  if (daysAhead === 0 && minutes >= 660) daysAhead = 7;
  const start = new Date(Date.UTC(wat.getUTCFullYear(), wat.getUTCMonth(), wat.getUTCDate() + daysAhead, 10, 0)); // 11:00 WAT = 10:00 UTC
  return { live, start };
}
