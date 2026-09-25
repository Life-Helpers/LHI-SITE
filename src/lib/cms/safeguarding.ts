import type { FieldOption } from "@/lib/cms/schema";

/**
 * Editorial safeguards for stories about people in vulnerable situations. A story is
 * treated as sensitive when an editor ticks "Sensitive story" or its title, excerpt or
 * tags mention one of the topics below. Sensitive stories can only be published by
 * someone with the "Approve sensitive stories" permission, after every check is ticked.
 */
export const SAFEGUARDING_CHECKS: FieldOption[] = [
  { value: "consent", label: "Consent to publish is on file for every person named or pictured" },
  { value: "no-child-survivor", label: "No child survivor can be identified (face, name, school or village)" },
  { value: "no-health-status", label: "No photo or name links a person to a health status such as HIV" },
  { value: "anonymised", label: "Names and places are changed or withheld where needed to protect people" },
];

const SENSITIVE_TOPICS =
  /\b(hiv|aids|gbv|gender[- ]based violence|sexual (violence|abuse|exploitation)|rape|abuse|survivors?|child protection|trafficking|mental health|psychosocial|suicide|fgm|child marriage|psea)\b/i;

export function isSensitivePost(post: { sensitive?: unknown; title?: unknown; excerpt?: unknown; tags?: unknown }) {
  if (post.sensitive === true) return true;
  const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
  return SENSITIVE_TOPICS.test(`${post.title ?? ""} ${post.excerpt ?? ""} ${tags}`);
}

/** Labels of the checks not yet ticked. */
export function missingChecks(ticked: unknown): string[] {
  const done = new Set(Array.isArray(ticked) ? ticked.map(String) : []);
  return SAFEGUARDING_CHECKS.filter((c) => !done.has(c.value)).map((c) => c.label);
}
