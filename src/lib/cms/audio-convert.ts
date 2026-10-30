"use client";

import { CONVERT_TO_MP3 } from "@/lib/cms/media-types";

/**
 * Turns audio that web browsers can't play (WMA, AMR, AIFF, CAF...) into MP3 in the admin's
 * browser before upload, using ffmpeg.wasm. The small wrapper is served from /vendor/ffmpeg (a
 * worker must come from this site); the ~30 MB engine is fetched from the CDN on first use only.
 */
const CORE = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";

const extOf = (name: string) => (name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "");

/** True when this file must be converted before it can play on the site. */
export function needsConversion(file: File) {
  return CONVERT_TO_MP3.includes(extOf(file.name));
}

type FFmpegLike = {
  load: (cfg: { coreURL: string; wasmURL: string }) => Promise<unknown>;
  on: (event: "progress", cb: (e: { progress: number }) => void) => void;
  off: (event: "progress", cb: (e: { progress: number }) => void) => void;
  writeFile: (name: string, data: Uint8Array) => Promise<unknown>;
  readFile: (name: string) => Promise<Uint8Array | string>;
  deleteFile: (name: string) => Promise<unknown>;
  exec: (args: string[]) => Promise<number>;
};

let engine: Promise<FFmpegLike> | null = null;

function loadEngine() {
  engine ??= (async () => {
    const mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${window.location.origin}/vendor/ffmpeg/index.js`)) as { FFmpeg: new () => FFmpegLike };
    const ffmpeg = new mod.FFmpeg();
    await ffmpeg.load({ coreURL: `${CORE}/ffmpeg-core.js`, wasmURL: `${CORE}/ffmpeg-core.wasm` });
    return ffmpeg;
  })().catch((e) => {
    engine = null;
    throw e;
  });
  return engine;
}

/** The file itself, or (for a format browsers can't play) an MP3 made from it. */
export async function toPlayableAudio(file: File, onProgress?: (percent: number) => void): Promise<File> {
  if (!needsConversion(file)) return file;
  let ffmpeg: FFmpegLike;
  try {
    ffmpeg = await loadEngine();
  } catch {
    throw new Error(`Couldn't load the audio converter for ${file.name}. Check your connection, or convert it to MP3 first.`);
  }
  const input = `in.${extOf(file.name)}`;
  const report = ({ progress }: { progress: number }) => onProgress?.(Math.max(0, Math.min(100, Math.round(progress * 100))));
  ffmpeg.on("progress", report);
  try {
    await ffmpeg.writeFile(input, new Uint8Array(await file.arrayBuffer()));
    // Speech-friendly MP3: 128 kbps, 44.1 kHz, no video.
    const code = await ffmpeg.exec(["-i", input, "-vn", "-ar", "44100", "-b:a", "128k", "out.mp3"]);
    if (code !== 0) throw new Error();
    const out = await ffmpeg.readFile("out.mp3");
    if (typeof out === "string" || out.byteLength === 0) throw new Error();
    const name = `${file.name.slice(0, file.name.lastIndexOf(".")) || "audio"}.mp3`;
    return new File([out as BlobPart], name, { type: "audio/mpeg" });
  } catch {
    throw new Error(`${file.name} couldn't be converted to MP3. The file may be damaged or protected.`);
  } finally {
    ffmpeg.off("progress", report);
    await ffmpeg.deleteFile(input).catch(() => undefined);
    await ffmpeg.deleteFile("out.mp3").catch(() => undefined);
  }
}
