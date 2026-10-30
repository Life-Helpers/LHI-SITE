import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

/** A path on this site only (no other hosts, no protocol-relative //). */
const safePath = (p: string | null) => (p && /^\/(?!\/)[^\s\\]*$/.test(p) ? p : "/");

/**
 * GET ?path=/blog/my-draft  → turns on preview (drafts visible) for this browser and opens the page.
 * GET ?exit=1&path=/...     → turns preview off again.
 * Only signed-in admin users can turn it on.
 */
export async function GET(req: NextRequest) {
  const path = safePath(req.nextUrl.searchParams.get("path"));
  const mode = await draftMode();
  if (req.nextUrl.searchParams.get("exit")) {
    mode.disable();
    return NextResponse.redirect(new URL(path, req.nextUrl.origin));
  }
  const user = await getCurrentUser();
  if (!user || user.mustChangePassword) return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  mode.enable();
  return NextResponse.redirect(new URL(path, req.nextUrl.origin));
}
