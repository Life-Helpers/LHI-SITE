/** Upload whitelist: extension -> MIME type. SVG is excluded because it can carry scripts. */
export const ALLOWED_MEDIA: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  pdf: "application/pdf",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  opus: "audio/ogg",
  flac: "audio/flac",
  weba: "audio/webm",
  webm: "audio/webm",
  mpga: "audio/mpeg",
  m4b: "audio/mp4",
};

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
/** Radio episodes can be long, so audio gets a larger limit. */
export const MAX_AUDIO_BYTES = 100 * 1024 * 1024;

/**
 * Audio formats web browsers can't play (Windows Media, phone recordings, Apple AIFF/CAF...). The admin
 * converts them to MP3 in the browser before uploading, so every recording plays on the site.
 */
export const CONVERT_TO_MP3 = ["wma", "amr", "awb", "3gp", "3ga", "3g2", "aif", "aiff", "aifc", "caf", "ac3", "mka", "ra", "au", "snd", "wv", "ape", "mov", "mkv", "avi"];

export const AUDIO_ACCEPT = `.mp3,.m4a,.m4b,.aac,.wav,.ogg,.oga,.opus,.flac,.weba,.webm,.mpga,.mp4,${CONVERT_TO_MP3.map((e) => `.${e}`).join(",")},audio/*`;

export function maxBytesFor(mimeType: string) {
  return mimeType.startsWith("audio/") ? MAX_AUDIO_BYTES : MAX_UPLOAD_BYTES;
}
