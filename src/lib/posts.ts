export function readingTime(content: string) {
  return `${Math.max(1, Math.round(content.split(/\s+/).length / 200))} min read`;
}

export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
