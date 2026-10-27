import { getStates } from "@/lib/cms/content";

/**
 * LHI's state offices (the same public details as the map on the site), for the HR portal's duty
 * station lists. Edited in the admin under States; read-only here.
 */
export async function GET() {
  const states = await getStates();
  const offices = states.filter((s) => s.office).map((s) => ({ id: s.id, name: s.name, office: s.office }));
  return Response.json(
    { offices },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400", "Access-Control-Allow-Origin": "*" } },
  );
}
