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
};

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
