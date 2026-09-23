import { buildCertificatePdf } from "@/lib/training/certificate-pdf";
import { findCertificate } from "@/lib/training/grading";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await findCertificate(code);
  if (!cert) return new Response("Certificate not found", { status: 404 });
  const pdf = await buildCertificatePdf(cert);
  return new Response(new Blob([pdf as BlobPart], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${cert.id}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
