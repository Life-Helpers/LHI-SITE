import { SettingsForm } from "@/components/cms/settings-form";
import { PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { readSettings } from "@/lib/cms/store";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requirePageUser("settings");
  return (
    <>
      <PageHeader
        title="Settings"
        description="Site-wide content: the home page feature story, NIDAKE figures and contact details."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Settings" }]}
      />
      <SettingsForm initial={await readSettings()} />
    </>
  );
}
