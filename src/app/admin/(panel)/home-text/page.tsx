import { HomeTextForm } from "@/components/cms/home-text-form";
import { PageHeader } from "@/components/cms/ui";
import { dictionaries, localeMeta, locales } from "@/i18n";
import { requirePageUser } from "@/lib/cms/auth";
import { readSettings } from "@/lib/cms/store";
import { HOME_TEXT_FIELDS, homeTextDefault } from "@/lib/home-text";

export const metadata = { title: "Home Page Text" };

export default async function HomeTextPage() {
  await requirePageUser("settings");
  const settings = await readSettings();
  const defaults = Object.fromEntries(
    locales.map((l) => [l, Object.fromEntries(HOME_TEXT_FIELDS.map((f) => [f.key, homeTextDefault(dictionaries[l].home, f.key)]))]),
  ) as Record<(typeof locales)[number], Record<string, string | string[]>>;

  return (
    <>
      <PageHeader
        title="Home Page Text"
        description="Headings and text on the home page, in each of the site's languages. Leave a box empty to keep the built-in text."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Home Page Text" }]}
      />
      <HomeTextForm languages={locales.map((l) => ({ id: l, label: localeMeta[l].label }))} defaults={defaults} initial={settings.homeText} />
    </>
  );
}
