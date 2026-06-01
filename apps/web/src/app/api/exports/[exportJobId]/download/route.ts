import { getOrCreateDevSession } from "@/server/auth";
import { generateExportCsv } from "@/server/services/exports";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ exportJobId: string }> },
) {
  const session = await getOrCreateDevSession();
  const { exportJobId } = await params;
  const csv = await generateExportCsv(session.cabinetId, exportJobId);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="export-${exportJobId}.csv"`,
    },
  });
}
