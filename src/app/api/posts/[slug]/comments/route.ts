import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getPostBySlug } from "@/lib/cms/content";
import { addComment } from "@/lib/cms/engagement";
import { checkSpam } from "@/lib/spam";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email address (it is not published).").max(200),
  body: z.string().trim().min(3, "Write a comment.").max(2000, "Comments can be up to 2,000 characters."),
  website: z.string().optional(),
});

/** New comments are held for moderation in Admin → Comments before they appear. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid comment." }, { status: 400 });
  }
  const spam = await checkSpam(req, { key: "comment", max: 10, honeypot: parsed.data.website });
  if ("blocked" in spam) return spam.blocked;
  if ("drop" in spam) return NextResponse.json({ ok: true });
  const comment = await addComment({ slug, postTitle: post.title, name: parsed.data.name, email: parsed.data.email, body: parsed.data.body });
  return NextResponse.json({ ok: true, approved: comment.status === "approved" });
}
