import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/cms/auth";
import { MIME_BY_EXT, readPrivateUpload } from "@/lib/cms/private-uploads";
import { hasRole } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; index: string }> }) {
  const user = await getCurrentUser();
  if (!user || !hasRole(user.role, "editor")) return new NextResponse("Not found", { status: 404 });

  const { id, index } = await params;
  const submission = (await readStore("submissions")).find((s) => s.id === id);
  const file = submission?.attachments?.[Number(index)];
  if (!file) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await readPrivateUpload(file.stored);
    const ext = file.stored.split(".").pop() ?? "";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.filename.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
