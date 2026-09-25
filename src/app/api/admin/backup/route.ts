import { Readable } from "node:stream";

import { logActivity } from "@/lib/cms/activity";
import { getCurrentUser } from "@/lib/cms/auth";
import { backupDocumentsStream, backupStream } from "@/lib/cms/backup";
import { databaseUrl, dbDumpAll } from "@/lib/cms/db";
import { can } from "@/lib/cms/schema";
import { DATA_DIR } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

/** Download a backup of the CMS content. Requires the Site settings permission. */
export async function GET() {
  const user = await getCurrentUser();
  if (!can(user, "settings")) return new Response("Not found", { status: 404 });
  await logActivity(user!, "downloaded a backup", "CMS data");
  const stamp = new Date().toISOString().slice(0, 10);
  // With the database store the backup holds every saved collection as JSON; uploaded files
  // live in Vercel Blob (or the data folder on disk) and are kept there.
  const stream = databaseUrl() ? backupDocumentsStream(await dbDumpAll()) : backupStream(DATA_DIR);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="lhi-cms-backup-${stamp}.tar.gz"`,
      "Cache-Control": "no-store",
    },
  });
}
