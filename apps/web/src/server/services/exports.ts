import { createExportJobSchema, type CreateExportJobInput } from "@shared/index";
import { writeAuditLog } from "../audit";
import { requireCabinetPermission } from "../auth";
import { prisma } from "../db";
import { calculateDeclarationSummary } from "./declarations";

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows: unknown[][]) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

export async function createExportJob(cabinetId: string, input: CreateExportJobInput) {
  const session = await requireCabinetPermission(cabinetId, "exports.run");
  const data = createExportJobSchema.parse(input);

  const job = await prisma.exportJob.create({
    data: {
      cabinetId,
      requestedBy: session.user.id,
      type: data.type,
      status: "COMPLETED",
      filters: {
        from: data.from,
        to: data.to,
      },
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "export.created",
    resourceType: "ExportJob",
    resourceId: job.id,
    metadata: { type: job.type },
  });

  return job;
}

export async function generateExportCsv(cabinetId: string, exportJobId: string) {
  await requireCabinetPermission(cabinetId, "exports.run");
  const job = await prisma.exportJob.findFirstOrThrow({
    where: { id: exportJobId, cabinetId },
  });
  const filters = job.filters as { from?: string; to?: string } | null;
  const from = new Date(filters?.from ?? new Date().toISOString());
  const to = new Date(filters?.to ?? new Date().toISOString());

  if (job.type === "payments_csv") {
    const payments = await prisma.payment.findMany({
      where: { cabinetId, paidAt: { gte: from, lte: to } },
      include: { invoice: true },
      orderBy: { paidAt: "asc" },
    });

    return toCsv([
      ["date", "invoice", "method", "amount_cents", "currency", "reference"],
      ...payments.map((payment) => [
        payment.paidAt.toISOString(),
        payment.invoice?.invoiceNumber ?? "",
        payment.method,
        payment.amountCents,
        payment.currency,
        payment.reference ?? "",
      ]),
    ]);
  }

  if (job.type === "invoices_csv") {
    const invoices = await prisma.invoice.findMany({
      where: { cabinetId, createdAt: { gte: from, lte: to } },
      include: { patient: true },
      orderBy: { createdAt: "asc" },
    });

    return toCsv([
      ["number", "status", "patient", "issued_at", "total_cents", "currency"],
      ...invoices.map((invoice) => [
        invoice.invoiceNumber,
        invoice.status,
        invoice.patient ? `${invoice.patient.firstName} ${invoice.patient.lastName}` : "",
        invoice.issuedAt?.toISOString() ?? "",
        invoice.totalCents,
        invoice.currency,
      ]),
    ]);
  }

  if (job.type === "expenses_csv") {
    const expenses = await prisma.expense.findMany({
      where: { cabinetId, expenseDate: { gte: from, lte: to } },
      orderBy: { expenseDate: "asc" },
    });

    return toCsv([
      ["date", "label", "supplier", "amount_cents", "currency"],
      ...expenses.map((expense) => [
        expense.expenseDate.toISOString(),
        expense.label,
        expense.supplier ?? "",
        expense.amountCents,
        expense.currency,
      ]),
    ]);
  }

  if (job.type === "retrocessions_csv") {
    const retrocessions = await prisma.retrocession.findMany({
      where: { cabinetId, periodStart: { lte: to }, periodEnd: { gte: from } },
      orderBy: { periodStart: "asc" },
    });

    return toCsv([
      ["period_start", "period_end", "direction", "status", "label", "counterparty", "amount_cents"],
      ...retrocessions.map((retrocession) => [
        retrocession.periodStart.toISOString(),
        retrocession.periodEnd.toISOString(),
        retrocession.direction,
        retrocession.status,
        retrocession.label,
        retrocession.counterparty,
        retrocession.amountCents,
      ]),
    ]);
  }

  const summary = await calculateDeclarationSummary(cabinetId, from, to);

  return toCsv([
    ["from", "to", "income_cents", "expense_cents", "retrocession_received_cents", "retrocession_paid_cents", "estimated_result_cents"],
    [
      from.toISOString(),
      to.toISOString(),
      summary.incomeCents,
      summary.expenseCents,
      summary.retrocessionReceivedCents,
      summary.retrocessionPaidCents,
      summary.estimatedResultCents,
    ],
  ]);
}
