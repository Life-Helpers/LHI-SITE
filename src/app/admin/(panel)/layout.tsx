import { AdminShell } from "@/components/cms/admin-shell";
import { requirePageUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { readStore, storageStatus } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser();
  const newSubmissions =
    !can(user, "submissions") ? 0 : (await readStore("submissions")).filter((s) => s.status === "new").length;
  const pendingComments =
    !can(user, "comments") ? 0 : (await readStore("comments")).filter((c) => c.status === "pending").length;
  const storage = storageStatus();
  const warnings = [
    storage.content === "temporary" &&
      "Content is being saved to temporary storage on this server and can be lost. Connect a Postgres database (DATABASE_URL) in the hosting settings.",
    storage.files === "temporary" &&
      "Uploaded files are being saved to temporary storage and can be lost. Connect Vercel Blob (BLOB_READ_WRITE_TOKEN) in the hosting settings.",
    !storage.sessionSecret && "Set CMS_SESSION_SECRET in the hosting settings so sign-ins stay valid across servers.",
  ].filter(Boolean) as string[];
  return (
    <AdminShell user={user} newSubmissions={newSubmissions} pendingComments={pendingComments}>
      {warnings.length > 0 && (
        <div role="alert" className="mb-6 rounded-xl border border-admin-danger/30 bg-admin-danger-soft px-4 py-3 text-sm text-admin-danger">
          <p className="font-semibold">Storage is not permanent yet</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {children}
    </AdminShell>
  );
}
