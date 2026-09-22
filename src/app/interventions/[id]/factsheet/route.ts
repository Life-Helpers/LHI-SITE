import { INTERVENTIONS_DATA } from "@/data/interventions-data";
import { buildFactsheetPdf } from "@/lib/factsheet-pdf";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return INTERVENTIONS_DATA.map((project) => ({ id: project.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = INTERVENTIONS_DATA.find((p) => p.id === id);
  if (!project) return new Response("Not found", { status: 404 });

  const pdf = await buildFactsheetPdf(project);
  return new Response(new Blob([pdf as BlobPart], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="LHI-factsheet-${project.id}.pdf"`,
    },
  });
}
