import { Readable } from "node:stream";

import { logActivity } from "@/lib/cms/activity";
import { getCurrentUser } from "@/lib/cms/auth";
import { backupStream } from "@/lib/cms/backup";
import { can } from "@/lib/cms/schema";
import { DATA_DIR } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

/** Download a full backup of the CMS data folder. Requires the Site settings permission. */
export async function GET() {
  const user = await getCurrentUser();
  if (!can(user, "settings")) return new Response("Not found", { status: 404 });
  await logActivity(user!, "downloaded a backup", "CMS data");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(Readable.toWeb(backupStream(DATA_DIR)) as ReadableStream, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="lhi-cms-backup-${stamp}.tar.gz"`,
      "Cache-Control": "no-store",
    },
  });
}
