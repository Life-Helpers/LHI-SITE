"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/cms/activity";
import { AuthError, requireUser } from "@/lib/cms/auth";
import { EMAIL_PROVIDERS, type EmailProviderId } from "@/lib/cms/schema";
import { readSettings, readStore, writeSettings } from "@/lib/cms/store";
import { saveApiKey } from "@/lib/email/config";
import { sendEmail } from "@/lib/email/send";

export interface SettingsResult {
  ok: boolean;
  error?: string;
  message?: string;
}

async function run(fn: () => Promise<SettingsResult>): Promise<SettingsResult> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, error: err.message };
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[email settings]", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
/** "Name <a@b.org>" or "a@b.org". */
const validFrom = (s: string) => {
  const m = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(s);
  return m ? EMAIL.test(m[2]) && !/[\r\n"<>]/.test(m[1]) : EMAIL.test(s.trim());
};

export async function saveEmailSettingsAction(input: {
  enabled: boolean;
  provider: string;
  domain: string;
  region: string;
  from: string;
  replyTo: string;
  /** Empty keeps the saved key. */
  apiKey: string;
  removeKey?: boolean;
}): Promise<SettingsResult> {
  return run(async () => {
    const user = await requireUser("settings");
    const current = await readSettings();
    const provider = (EMAIL_PROVIDERS as readonly string[]).includes(input.provider) ? (input.provider as EmailProviderId) : "mailgun";
    const domain = String(input.domain ?? "").trim().toLowerCase().slice(0, 120);
    const from = String(input.from ?? "").trim().slice(0, 200);
    const replyTo = String(input.replyTo ?? "").trim().toLowerCase().slice(0, 200);
    const apiKey = String(input.apiKey ?? "").trim().slice(0, 300);
    if (from && !validFrom(from)) return { ok: false, error: "Sender: use an address like news@mg.lhinigeria.org, or Life Helpers Initiative <news@mg.lhinigeria.org>." };
    if (replyTo && !EMAIL.test(replyTo)) return { ok: false, error: "Reply-to must be one email address." };
    if (provider === "mailgun" && domain && !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) return { ok: false, error: "Mailgun domain should look like mg.lhinigeria.org." };
    if (apiKey && /\s/.test(apiKey)) return { ok: false, error: "The API key can't contain spaces." };

    let keyHint = current.email.keyHint;
    if (input.removeKey) {
      await saveApiKey("");
      keyHint = "";
    } else if (apiKey) {
      await saveApiKey(apiKey);
      keyHint = apiKey.slice(-4);
    }
    const enabled = Boolean(input.enabled);
    if (enabled) {
      if (!keyHint) return { ok: false, error: "Add the API key before switching email on." };
      if (!from) return { ok: false, error: "Add the sender address before switching email on." };
      if (provider === "mailgun" && !domain) return { ok: false, error: "Add the Mailgun sending domain before switching email on." };
    }
    await writeSettings({ ...current, email: { enabled, provider, domain, region: input.region === "eu" ? "eu" : "us", from, replyTo, keyHint } });
    await logActivity(user, `${enabled ? "switched email on" : "saved email settings (email off)"}${apiKey ? ", new API key" : ""}`, "Email & Pop-up", "/admin/email-settings");
    revalidatePath("/admin", "layout");
    return { ok: true, message: enabled ? "Saved. Email is on." : "Saved. Email is off: messages wait in the Outbox." };
  });
}

/** Sends a test message to the signed-in admin and waits for the provider's answer. */
export async function sendTestEmailAction(): Promise<SettingsResult> {
  return run(async () => {
    const user = await requireUser("settings");
    if (!user.email) return { ok: false, error: "Your account has no email address. Add one in Profile first." };
    const record = await sendEmail({
      to: user.email,
      subject: "Test email from lhinigeria.org",
      kind: "test",
      wait: true,
      content: { heading: "Email is working", paragraphs: ["This is a test from Admin → Email & Pop-up. If you can read it, the website can send emails."] },
    });
    if (!record) return { ok: false, error: "Couldn't create the test email." };
    const sent = (await readStore("outbox")).find((e) => e.id === record.id);
    if (sent?.status === "sent") return { ok: true, message: `Sent to ${user.email}. Check your inbox (and spam folder).` };
    if (sent?.status === "failed") return { ok: false, error: `Not sent: ${sent.error ?? "the provider refused it"}.` };
    return { ok: false, error: "Email is off or not fully set up, so the test is waiting in the Email Outbox." };
  });
}

export async function savePopupAction(input: { enabled: boolean; showAgain?: boolean }): Promise<SettingsResult> {
  return run(async () => {
    const user = await requireUser("settings");
    const current = await readSettings();
    const popup = { enabled: Boolean(input.enabled), campaign: input.showAgain ? String(Date.now()) : current.popup.campaign };
    await writeSettings({ ...current, popup });
    await logActivity(user, input.showAgain ? "reset the newsletter pop-up so everyone sees it once more" : `turned the newsletter pop-up ${popup.enabled ? "on" : "off"}`, "Email & Pop-up", "/admin/email-settings");
    revalidatePath("/", "layout");
    return { ok: true, message: input.showAgain ? "Every visitor will see the pop-up once more." : `Pop-up ${popup.enabled ? "on" : "off"}.` };
  });
}
