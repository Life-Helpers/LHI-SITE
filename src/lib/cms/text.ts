/** "Label | Value" lines (as typed in the admin) → figures. Lines without both parts are skipped. */
export function parseStats(lines: string[]): { label: string; value: string }[] {
  return lines
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([label, value]) => label && value)
    .map(([label, value]) => ({ label, value }));
}

/** Text with blank-line-separated paragraphs → paragraphs. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
