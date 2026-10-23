import { redirect } from "next/navigation";

import { hrSignOutAction } from "@/app/hrportal/actions";
import { PortalAuthCard } from "@/components/hr/portal-shell";
import { homePath } from "@/lib/hr/access";
import { HR_PROBLEM_MESSAGES, loadHrSession } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "No access" };

/** Shown to a signed-in account that is inactive, has no valid role, or isn't linked to a current employee. */
export default async function NoAccessPage() {
  const state = await loadHrSession();
  if (state.status === "signed-out") redirect("/hrportal");
  if (state.status === "ok") redirect(homePath(state.ctx.permissions));
  return (
    <PortalAuthCard title="No access to the HR portal">
      <p role="alert" className="text-sm text-admin-text">
        {HR_PROBLEM_MESSAGES[state.problem]}
      </p>
      <form action={hrSignOutAction} className="mt-5">
        <button type="submit" className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold text-admin-text hover:bg-admin-bg">
          Sign out
        </button>
      </form>
    </PortalAuthCard>
  );
}
