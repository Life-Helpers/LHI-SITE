import type { LessonBlock } from "@/data/training/courses";

/**
 * Lessons are written in the admin as plain text and stored as blocks:
 *
 *   A paragraph is any text. Leave a blank line between blocks.
 *
 *   ## Optional list title
 *   - a bullet
 *   - another bullet
 *
 *   ## Optional steps title
 *   1. first step
 *   2. second step
 *
 *   [!warning] A highlighted box (info, warning or success)
 *   The text inside the box.
 */
const TONES = ["info", "warning", "success"] as const;

export function blocksToText(blocks: LessonBlock[]): string {
  return blocks
    .map((b) => {
      const head = "title" in b && b.title && b.type !== "callout" ? `## ${b.title}\n` : "";
      switch (b.type) {
        case "p":
          return b.text;
        case "list":
          return head + b.items.map((i) => `- ${i}`).join("\n");
        case "steps":
          return head + b.items.map((i, n) => `${n + 1}. ${i}`).join("\n");
        case "callout":
          return `[!${b.tone}] ${b.title}\n${b.text}`;
      }
    })
    .join("\n\n");
}

export function textToBlocks(text: string): LessonBlock[] {
  const blocks: LessonBlock[] = [];
  for (const chunk of text.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    let lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const callout = /^\[!(\w+)\]\s*(.*)$/.exec(lines[0]);
    if (callout) {
      const tone = (TONES as readonly string[]).includes(callout[1].toLowerCase()) ? (callout[1].toLowerCase() as (typeof TONES)[number]) : "info";
      blocks.push({ type: "callout", tone, title: callout[2].trim(), text: lines.slice(1).join(" ") });
      continue;
    }
    let title: string | undefined;
    if (lines[0].startsWith("## ")) {
      title = lines[0].slice(3).trim();
      lines = lines.slice(1);
    }
    if (lines.length && lines.every((l) => /^[-*•]\s+/.test(l))) {
      blocks.push({ type: "list", ...(title ? { title } : {}), items: lines.map((l) => l.replace(/^[-*•]\s+/, "")) });
    } else if (lines.length && lines.every((l) => /^\d+[.)]\s+/.test(l))) {
      blocks.push({ type: "steps", ...(title ? { title } : {}), items: lines.map((l) => l.replace(/^\d+[.)]\s+/, "")) });
    } else {
      const body = [title, ...lines].filter(Boolean).join(" ");
      if (body) blocks.push({ type: "p", text: body });
    }
  }
  return blocks;
}
