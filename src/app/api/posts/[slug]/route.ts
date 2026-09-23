import { NextResponse } from "next/server";

import { getPostBySlug } from "@/lib/cms/content";
import { getEngagement } from "@/lib/cms/engagement";

export const dynamic = "force-dynamic";

/** Public engagement for a post: like count and approved comments. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await getPostBySlug(slug))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await getEngagement(slug), { headers: { "Cache-Control": "no-store" } });
}
