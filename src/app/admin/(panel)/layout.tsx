import { AdminShell } from "@/components/cms/admin-shell";
import { requirePageUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser();
  const newSubmissions =
    !can(user, "submissions") ? 0 : (await readStore("submissions")).filter((s) => s.status === "new").length;
  const pendingComments =
    !can(user, "comments") ? 0 : (await readStore("comments")).filter((c) => c.status === "pending").length;
  return (
    <AdminShell user={user} newSubmissions={newSubmissions} pendingComments={pendingComments}>
      {children}
    </AdminShell>
  );
}
