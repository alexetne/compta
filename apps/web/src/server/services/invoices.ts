import { createInvoiceSchema, type CreateInvoiceInput } from "@shared/index";
import { writeAuditLog } from "../audit";
import { requireCabinetPermission } from "../auth";
import { prisma } from "../db";

function invoiceYear(date = new Date()) {
  return date.getUTCFullYear();
}

async function nextInvoiceNumber(cabinetId: string) {
  const year = invoiceYear();
  const prefix = `${year}-`;
  const count = await prisma.invoice.count({
    where: {
      cabinetId,
      invoiceNumber: { startsWith: prefix },
    },
  });

  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}

export async function syncInvoicePaymentStatus(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });

  if (!invoice || invoice.status === "DRAFT" || invoice.status === "CANCELLED") {
    return invoice;
  }

  const paidCents = invoice.payments.reduce((total, payment) => total + payment.amountCents, 0);
  const status =
    paidCents <= 0 ? "ISSUED" : paidCents >= invoice.totalCents ? "PAID" : "PARTIALLY_PAID";

  return prisma.invoice.update({
    where: { id: invoice.id },
    data: { status },
  });
}

export async function createInvoice(cabinetId: string, input: CreateInvoiceInput) {
  const session = await requireCabinetPermission(cabinetId, "billing.manage");
  const data = createInvoiceSchema.parse(input);
  const invoiceNumber = await nextInvoiceNumber(cabinetId);
  const totalCents = data.lines.reduce(
    (total, line) => total + line.quantity * line.unitCents,
    0,
  );

  const invoice = await prisma.invoice.create({
    data: {
      cabinetId,
      patientId: data.patientId,
      invoiceNumber,
      status: "DRAFT",
      issuedAt: data.issuedAt ? new Date(data.issuedAt) : undefined,
      dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
      totalCents,
      notes: data.notes,
      lines: {
        create: data.lines.map((line) => ({
          serviceItemId: line.serviceItemId,
          label: line.label,
          quantity: line.quantity,
          unitCents: line.unitCents,
          totalCents: line.quantity * line.unitCents,
        })),
      },
    },
    include: { lines: true },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "invoice.created",
    resourceType: "Invoice",
    resourceId: invoice.id,
    metadata: { invoiceNumber, totalCents },
  });

  return invoice;
}

export async function issueInvoice(cabinetId: string, invoiceId: string) {
  const session = await requireCabinetPermission(cabinetId, "billing.manage");
  const existingInvoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, cabinetId },
    select: { status: true },
  });

  if (!existingInvoice || existingInvoice.status !== "DRAFT") {
    throw new Error("Seule une facture brouillon peut etre emise");
  }

  const invoice = await prisma.invoice.update({
    where: { id: invoiceId, cabinetId },
    data: {
      status: "ISSUED",
      issuedAt: new Date(),
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "invoice.issued",
    resourceType: "Invoice",
    resourceId: invoice.id,
    metadata: { invoiceNumber: invoice.invoiceNumber },
  });

  return invoice;
}

export async function cancelInvoice(cabinetId: string, invoiceId: string) {
  const session = await requireCabinetPermission(cabinetId, "billing.manage");
  const existingInvoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, cabinetId },
    select: { status: true },
  });

  if (!existingInvoice || existingInvoice.status === "PAID" || existingInvoice.status === "CANCELLED") {
    throw new Error("Cette facture ne peut pas etre annulee");
  }

  const invoice = await prisma.invoice.update({
    where: { id: invoiceId, cabinetId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "invoice.cancelled",
    resourceType: "Invoice",
    resourceId: invoice.id,
    metadata: { invoiceNumber: invoice.invoiceNumber },
  });

  return invoice;
}
