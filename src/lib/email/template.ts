import { siteConfig } from "@/config/site";

export interface EmailContent {
  /** Greeting line, e.g. "Hello Amina,". */
  greeting?: string;
  heading: string;
  /** Plain-text paragraphs. Blank lines inside a paragraph are not needed; pass separate items. */
  paragraphs: string[];
  cta?: { label: string; url: string };
  /** Small print under the signature, e.g. an unsubscribe link. */
  footer?: { text: string; url?: string; linkLabel?: string };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Turn bare URLs in escaped text into links. */
const linkify = (s: string) => s.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#d51319">$1</a>');

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${siteConfig.url.replace(/\/$/, "")}${path}`;
}

/** Render a branded email as both plain text and simple, inline-styled HTML. */
export function renderEmail(content: EmailContent): { text: string; html: string } {
  const sign = `${siteConfig.name}\n${siteConfig.url}`;
  const text = [
    content.greeting,
    content.heading,
    ...content.paragraphs,
    content.cta ? `${content.cta.label}: ${content.cta.url}` : undefined,
    `— ${sign}`,
    content.footer ? `${content.footer.text}${content.footer.url ? ` ${content.footer.url}` : ""}` : undefined,
  ]
    .filter(Boolean)
    .join("\n\n");

  const paragraphs = content.paragraphs
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6">${linkify(esc(p)).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const cta = content.cta
    ? `<p style="margin:24px 0"><a href="${esc(content.cta.url)}" style="display:inline-block;background:#d51319;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:999px">${esc(content.cta.label)}</a></p>`
    : "";
  const footer = content.footer
    ? `<p style="margin:16px 0 0;font-size:12px;color:#6b7280">${esc(content.footer.text)}${
        content.footer.url
          ? ` <a href="${esc(content.footer.url)}" style="color:#6b7280">${esc(content.footer.linkLabel ?? content.footer.url)}</a>`
          : ""
      }</p>`
    : "";

  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f4;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1c1917">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#d51319;height:6px"></td></tr>
<tr><td style="padding:28px 32px 8px"><img src="${absoluteUrl("/logo.png")}" alt="${esc(siteConfig.name)}" height="40" style="height:40px"></td></tr>
<tr><td style="padding:8px 32px 32px;font-size:15px">
${content.greeting ? `<p style="margin:0 0 12px">${esc(content.greeting)}</p>` : ""}
<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400;font-size:26px;line-height:1.25">${esc(content.heading)}</h1>
${paragraphs}${cta}
<p style="margin:24px 0 0;color:#57534e">— ${esc(siteConfig.name)}<br><a href="${esc(siteConfig.url)}" style="color:#d51319">${esc(siteConfig.url.replace(/^https?:\/\//, ""))}</a></p>
${footer}
</td></tr></table></td></tr></table></body></html>`;

  return { text, html };
}
