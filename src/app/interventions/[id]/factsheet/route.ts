import { getIntervention, getInterventions, getSettings, getStates } from "@/lib/cms/content";
import { buildFactsheetPdf } from "@/lib/factsheet-pdf";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getInterventions()).map((project) => ({ id: project.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getIntervention(id);
  if (!project) return new Response("Not found", { status: 404 });

  const [states, settings] = await Promise.all([getStates(), getSettings()]);
  const pdf = await buildFactsheetPdf(project, { states, contact: settings.contact });
  return new Response(new Blob([pdf as BlobPart], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="LHI-factsheet-${project.id}.pdf"`,
    },
  });
}
