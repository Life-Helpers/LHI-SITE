import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

import { AuthError, requireUser } from "@/lib/cms/auth";
import { blobEnabled, blobAccess } from "@/lib/cms/files";
import { ALLOWED_MEDIA, maxBytesFor } from "@/lib/cms/media-types";

export const dynamic = "force-dynamic";

const MAX_MAGAZINE_PDF_BYTES = 60 * 1024 * 1024;

/** Whether large files should go straight from the browser to Vercel Blob (and with which access). */
export async function GET() {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ direct: blobEnabled() ? blobAccess() : null });
}

/**
 * Issues short-lived tokens for direct browser uploads to Vercel Blob, which lets admins upload
 * files larger than the 4.5 MB request limit of serverless functions (radio episodes, magazine PDFs).
 * Each token is limited to one pathname, one content type and a maximum size.
 */
export async function POST(req: NextRequest) {
  if (!blobEnabled()) return NextResponse.json({ error: "Direct uploads need Vercel Blob." }, { status: 404 });
  const body = (await req.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const purpose = (() => {
          try {
            return String(JSON.parse(clientPayload ?? "{}").purpose ?? "");
          } catch {
            return "";
          }
        })();
        if (purpose === "media") {
          await requireUser("media");
          const m = /^uploads\/[a-z0-9-]{1,60}-[0-9a-f]{8}\.([a-z0-9]+)$/.exec(pathname);
          const mimeType = m ? ALLOWED_MEDIA[m[1]] : undefined;
          if (!mimeType) throw new AuthError("File type not allowed.");
          return { allowedContentTypes: [mimeType], maximumSizeInBytes: maxBytesFor(mimeType), addRandomSuffix: false, allowOverwrite: false };
        }
        if (purpose === "magazine-pdf") {
          await requireUser("magazines");
          if (!/^uploads\/mag-[a-z0-9-]{1,80}\.pdf$/.test(pathname)) throw new AuthError("Invalid magazine file name.");
          return { allowedContentTypes: ["application/pdf"], maximumSizeInBytes: MAX_MAGAZINE_PDF_BYTES, addRandomSuffix: false, allowOverwrite: true };
        }
        throw new AuthError("Unknown upload.");
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof AuthError ? err.message : "Upload could not be authorised.";
    return NextResponse.json({ error: message }, { status: err instanceof AuthError ? 403 : 400 });
  }
}
