import { AdminShell } from "@/components/cms/admin-shell";
import { requirePageUser } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser("author");
  const newSubmissions =
    user.role === "author" ? 0 : (await readStore("submissions")).filter((s) => s.status === "new").length;
  const pendingComments =
    user.role === "author" ? 0 : (await readStore("comments")).filter((c) => c.status === "pending").length;
  return (
    <AdminShell user={user} newSubmissions={newSubmissions} pendingComments={pendingComments}>
      {children}
    </AdminShell>
  );
}
