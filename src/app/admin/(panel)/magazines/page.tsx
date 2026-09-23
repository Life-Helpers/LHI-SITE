import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";

import { DeleteMagazineButton } from "@/components/cms/delete-magazine-button";
import { Badge, buttonClass, Card, formatDate, PageHeader } from "@/components/cms/ui";
import { MAGAZINES } from "@/data/magazines";
import { requirePageUser } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Magazines" };

export default async function MagazinesAdminPage() {
  await requirePageUser("magazines");
  const uploaded = (await readStore("magazines")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <>
      <PageHeader
        title="Project Magazines"
        description="Magazines, bulletins and newsletters shown as flipbooks on the Project Magazines page."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Magazines" }]}
        actions={
          <Link href="/admin/magazines/new" className={buttonClass.primary}>
            <Plus className="h-4 w-4" /> Upload magazine
          </Link>
        }
      />
      <Card title="Uploaded magazines" bodyClassName="p-0">
        {uploaded.length === 0 ? (
          <p className="p-6 text-sm text-admin-muted">No magazines uploaded yet. Use “Upload magazine” to add one from a PDF.</p>
        ) : (
          <ul className="divide-y divide-admin-border">
            {uploaded.map((m) => (
              <li key={m.slug} className="flex flex-wrap items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- uploaded page image */}
                <img src={`/media/mag-${m.slug}-01.webp`} alt="" className="h-20 w-14 rounded object-cover shadow" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.title}</p>
                  <p className="text-xs text-admin-muted">
                    {m.kind}
                    {m.period ? ` · ${m.period}` : ""} · {m.pages} pages · uploaded {formatDate(m.createdAt)} by {m.createdBy}
                  </p>
                </div>
                <Badge tone={m.status === "published" ? "success" : "warning"}>{m.status}</Badge>
                <Link href={`/project-magazines/${m.slug}`} target="_blank" className={buttonClass.secondary}>
                  <ExternalLink className="h-4 w-4" /> View
                </Link>
                <DeleteMagazineButton slug={m.slug} title={m.title} />
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Built-in editions" className="mt-6">
        <p className="text-sm text-admin-muted">
          {MAGAZINES.length} editions are part of the website itself (for example {MAGAZINES[0]?.title}). They always appear after uploaded
          magazines.
        </p>
      </Card>
    </>
  );
}
