import type { z } from "zod";

/**
 * A message safe to show visitors: our own schema messages pass through, while zod's
 * built-in technical ones ("Invalid input: expected string…") become a plain fallback.
 */
export function formError(error: z.ZodError, fallback = "Please check the form and try again.") {
  const message = error.issues[0]?.message;
  if (!message || /^(Invalid input|Invalid option|Invalid string|Invalid type|Expected |Required$|Too (big|small))/i.test(message)) {
    return fallback;
  }
  return message;
}

/** JSON for a <script type="application/ld+json"> tag, with "<" escaped so content can't close the tag. */
export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
