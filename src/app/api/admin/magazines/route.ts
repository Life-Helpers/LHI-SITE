import { unlink, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { logActivity } from "@/lib/cms/activity";
import { AuthError, requireUser } from "@/lib/cms/auth";
import { slugify } from "@/lib/cms/schema";
import { readStore, UPLOADS_DIR, updateStore } from "@/lib/cms/store";
import { revalidatePath } from "next/cache";
import { optimizeUpload } from "@/lib/media/optimize";

export const dynamic = "force-dynamic";

const MAX_PAGE_BYTES = 4 * 1024 * 1024;
const MAX_PDF_BYTES = 60 * 1024 * 1024;
const MAX_PAGES = 120;

const pageFile = (slug: string, n: number) => `mag-${slug}-${String(n).padStart(2, "0")}.webp`;

async function auth() {
  try {
    return await requireUser("magazines");
  } catch (err) {
    throw NextResponse.json({ error: err instanceof AuthError ? err.message : "Unauthorized" }, { status: 401 });
  }
}

/**
 * Upload steps (multipart):
 *  - action=page   slug, page (1-based), file (WebP rendered in the browser)
 *  - action=pdf    slug, file (the original PDF for download)
 *  - action=save   slug, title, kind, period, description, partners, story, pages, status
 */
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await auth();
  } catch (res) {
    return res as NextResponse;
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  const action = String(form.get("action") ?? "");
  const slug = slugify(String(form.get("slug") ?? ""));
  if (!slug) return NextResponse.json({ error: "Missing magazine slug." }, { status: 400 });
  await mkdir(UPLOADS_DIR, { recursive: true });

  if (action === "page") {
    const n = Number(form.get("page"));
    const file = form.get("file");
    if (!Number.isInteger(n) || n < 1 || n > MAX_PAGES || !(file instanceof File)) return NextResponse.json({ error: "Invalid page." }, { status: 400 });
    if (file.type !== "image/webp" || file.size > MAX_PAGE_BYTES) return NextResponse.json({ error: "Pages must be WebP images under 4 MB." }, { status: 400 });
    await writeFile(path.join(UPLOADS_DIR, pageFile(slug, n)), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ ok: true });
  }

  if (action === "pdf") {
    const file = form.get("file");
    if (!(file instanceof File) || file.type !== "application/pdf" || file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "Upload a PDF under 60 MB." }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.subarray(0, 5).toString() !== "%PDF-") return NextResponse.json({ error: "That file is not a PDF." }, { status: 400 });
    await writeFile(path.join(UPLOADS_DIR, `mag-${slug}.pdf`), (await optimizeUpload(bytes, "application/pdf")).buffer);
    return NextResponse.json({ ok: true, url: `/media/mag-${slug}.pdf` });
  }

  if (action === "save") {
    const text = (k: string, max = 300) => String(form.get(k) ?? "").trim().slice(0, max);
    const pages = Number(form.get("pages"));
    const title = text("title", 200);
    if (!title) return NextResponse.json({ error: "Enter a title." }, { status: 400 });
    if (!Number.isInteger(pages) || pages < 1 || pages > MAX_PAGES) return NextResponse.json({ error: "Invalid page count." }, { status: 400 });
    const story = text("story", 300);
    if (story && !story.startsWith("/") && !/^https?:\/\//.test(story)) return NextResponse.json({ error: "The story link must start with / or https://" }, { status: 400 });
    const record = {
      slug,
      title,
      kind: text("kind", 80) || "Project Magazine",
      period: text("period", 80),
      description: text("description", 600),
      partners: text("partners", 200),
      story,
      pages,
      pdf: `/media/mag-${slug}.pdf`,
      status: (text("status") === "draft" ? "draft" : "published") as "draft" | "published",
      createdAt: new Date().toISOString(),
      createdBy: user.name,
    };
    await updateStore("magazines", (items) => ({ items: [record, ...items.filter((m) => m.slug !== slug)] }));
    await logActivity(user, "uploaded magazine", title, `/project-magazines/${slug}`);
    revalidatePath("/project-magazines", "layout");
    return NextResponse.json({ ok: true, slug });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

/** DELETE ?slug= removes an uploaded magazine and its files. */
export async function DELETE(req: NextRequest) {
  let user;
  try {
    user = await auth();
  } catch (res) {
    return res as NextResponse;
  }
  const slug = slugify(req.nextUrl.searchParams.get("slug") ?? "");
  const removed = await updateStore("magazines", (items) => ({ items: items.filter((m) => m.slug !== slug), result: items.find((m) => m.slug === slug) }));
  if (!removed) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await Promise.all([
    ...Array.from({ length: removed.pages }, (_, i) => unlink(path.join(UPLOADS_DIR, pageFile(slug, i + 1))).catch(() => undefined)),
    unlink(path.join(UPLOADS_DIR, `mag-${slug}.pdf`)).catch(() => undefined),
  ]);
  await logActivity(user, "deleted magazine", removed.title);
  revalidatePath("/project-magazines", "layout");
  return NextResponse.json({ ok: true });
}

export async function GET() {
  try {
    await auth();
  } catch (res) {
    return res as NextResponse;
  }
  return NextResponse.json({ items: await readStore("magazines") });
}
