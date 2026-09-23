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
};

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
/** Radio episodes can be long, so audio gets a larger limit. */
export const MAX_AUDIO_BYTES = 100 * 1024 * 1024;

export const AUDIO_ACCEPT = ".mp3,.m4a,.aac,.wav,.ogg,.oga,.opus,audio/*";

export function maxBytesFor(mimeType: string) {
  return mimeType.startsWith("audio/") ? MAX_AUDIO_BYTES : MAX_UPLOAD_BYTES;
}
