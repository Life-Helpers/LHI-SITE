import { NextRequest, NextResponse } from "next/server";

import { getPostBySlug } from "@/lib/cms/content";
import { changeLikes } from "@/lib/cms/engagement";
import { rateLimited } from "@/lib/cms/submissions";

/** POST {"liked": true|false}: the browser remembers its own like; this keeps the shared count. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (await rateLimited(req, "like", 120)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const { slug } = await params;
  if (!(await getPostBySlug(slug))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (typeof body?.liked !== "boolean") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const likes = await changeLikes(slug, body.liked ? 1 : -1);
  return NextResponse.json({ likes });
}
