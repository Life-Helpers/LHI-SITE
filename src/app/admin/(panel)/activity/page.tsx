import Link from "next/link";

import { Card, formatDate, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Activity Log" };

export default async function ActivityPage() {
  await requirePageUser("administrator");
  const entries = await readStore("activity");
  return (
    <>
      <PageHeader
        title="Activity Log"
        description="Every sign-in, edit, upload and deletion (last 500 entries)."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Activity" }]}
      />
      <Card bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-[11px] font-bold uppercase tracking-wider text-admin-muted">
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((a) => (
              <tr key={a.id} className="border-b border-admin-border last:border-0">
                <td className="whitespace-nowrap px-5 py-2.5 text-admin-muted">{formatDate(a.at, true)}</td>
                <td className="px-5 py-2.5 font-medium">{a.user}</td>
                <td className="px-5 py-2.5">
                  {a.action}{" "}
                  {a.href ? (
                    <Link href={a.href} className="text-admin-primary hover:underline">
                      {a.target}
                    </Link>
                  ) : (
                    <span className="text-admin-muted">{a.target}</span>
                  )}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-admin-muted">
                  No activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
