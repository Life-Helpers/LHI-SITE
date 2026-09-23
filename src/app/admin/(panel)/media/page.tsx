import { MediaLibrary } from "@/components/cms/media-library";
import { PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Media Library" };

export default async function MediaPage() {
  const user = await requirePageUser("media");
  const items = await readStore("media");
  return (
    <>
      <PageHeader
        title="Media Library"
        description="Photos, partner logos, PDFs and videos used across the website."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Media" }]}
      />
      <MediaLibrary items={items} canDelete={can(user, "media.delete")} />
    </>
  );
}
