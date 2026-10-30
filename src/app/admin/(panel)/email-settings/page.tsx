import { EmailSettingsForm, PopupSettingsForm } from "@/components/cms/email-settings-form";
import { PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { readSettings } from "@/lib/cms/store";
import { getEmailConfig } from "@/lib/email/config";

export const metadata = { title: "Email & Pop-up" };
export const dynamic = "force-dynamic";

export default async function EmailSettingsPage() {
  await requirePageUser("settings");
  const [{ email, popup }, active] = await Promise.all([readSettings(), getEmailConfig().catch(() => null)]);
  return (
    <>
      <PageHeader
        title="Email & Pop-up"
        description="Connect the website to Mailgun so password resets, form alerts and newsletters are delivered, and choose whether visitors see the newsletter pop-up."
        site={[{ label: "Home page (pop-up)", href: "/" }]}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Email & Pop-up" }]}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <EmailSettingsForm
            initial={{ enabled: email.enabled, provider: email.provider, domain: email.domain, region: email.region, from: email.from, replyTo: email.replyTo }}
            keyHint={email.keyHint}
            status={active ? `Sending through ${active.provider}${active.source === "environment" ? " (set on the server)" : ""}.` : email.keyHint && !email.enabled ? "Email is switched off: messages wait in the Email Outbox." : "Not connected: messages wait in the Email Outbox."}
            live={Boolean(active)}
          />
        </div>
        <PopupSettingsForm enabled={popup.enabled} />
      </div>
    </>
  );
}
