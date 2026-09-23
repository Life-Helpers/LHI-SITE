import { MagazineUploader } from "@/components/cms/magazine-uploader";
import { Card, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";

export const metadata = { title: "Upload magazine" };

export default async function NewMagazinePage() {
  await requirePageUser("magazines");
  return (
    <>
      <PageHeader
        title="Upload a magazine"
        description="Upload a magazine, bulletin or newsletter PDF. It appears in Project Magazines as a flipbook with a PDF download."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Magazines", href: "/admin/magazines" }, { label: "Upload" }]}
      />
      <Card>
        <MagazineUploader />
      </Card>
    </>
  );
}
