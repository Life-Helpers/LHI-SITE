import { readFile } from "node:fs/promises";
import path from "node:path";

import { readStore, updateStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { payslipFileName, payslipPdf } from "@/lib/hr/payslip-pdf";
import { loadHrSession } from "@/lib/hr/session";

const notFound = () => new Response("Not found", { status: 404 });

/** Download a payslip as PDF: its owner (once published), or someone who may see everyone's payslips. */
export async function GET(req: Request, { params }: { params: Promise<{ payslipId: string }> }) {
  const state = await loadHrSession();
  if (state.status !== "ok") return notFound();
  const { ctx } = state;
  const { payslipId } = await params;
  const slip = (await readStore("hrPayslips")).find((p) => p.id === payslipId);
  const own = slip?.employeeId === ctx.employee.id;
  if (!slip || !((own && slip.status === "published") || has(ctx.permissions, "payroll.payslips.view"))) return notFound();
  if (own && slip.status === "published" && !slip.viewedAt) {
    const at = new Date().toISOString();
    await updateStore("hrPayslips", (items) => ({ items: items.map((p) => (p.id === slip.id && !p.viewedAt ? { ...p, viewedAt: at } : p)) }));
  }
  // The logo from disk, or (where public files aren't bundled with the function) from the site itself.
  const logo =
    (await readFile(path.join(process.cwd(), "public", "logo.png")).catch(() => undefined)) ??
    (await fetch(new URL("/logo.png", req.url))
      .then(async (r) => (r.ok ? new Uint8Array(await r.arrayBuffer()) : undefined))
      .catch(() => undefined));
  const pdf = await payslipPdf(slip, logo);
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${payslipFileName(slip)}"`,
      "cache-control": "private, no-store",
    },
  });
}
