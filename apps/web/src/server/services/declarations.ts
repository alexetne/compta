import {
  createDeclarationPeriodSchema,
  type CreateDeclarationPeriodInput,
} from "@shared/index";
import { writeAuditLog } from "../audit";
import { requireCabinetPermission } from "../auth";
import { prisma } from "../db";

export type DeclarationSummary = {
  incomeCents: number;
  expenseCents: number;
  retrocessionReceivedCents: number;
  retrocessionPaidCents: number;
  estimatedResultCents: number;
};

export async function calculateDeclarationSummary(
  cabinetId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<DeclarationSummary> {
  const [payments, expenses, retrocessionsReceived, retrocessionsPaid] = await Promise.all([
    prisma.payment.aggregate({
      where: { cabinetId, paidAt: { gte: periodStart, lte: periodEnd } },
      _sum: { amountCents: true },
    }),
    prisma.expense.aggregate({
      where: { cabinetId, expenseDate: { gte: periodStart, lte: periodEnd } },
      _sum: { amountCents: true },
    }),
    prisma.retrocession.aggregate({
      where: {
        cabinetId,
        direction: "RECEIVED",
        status: { not: "CANCELLED" },
        periodStart: { lte: periodEnd },
        periodEnd: { gte: periodStart },
      },
      _sum: { amountCents: true },
    }),
    prisma.retrocession.aggregate({
      where: {
        cabinetId,
        direction: "PAID",
        status: { not: "CANCELLED" },
        periodStart: { lte: periodEnd },
        periodEnd: { gte: periodStart },
      },
      _sum: { amountCents: true },
    }),
  ]);

  const incomeCents = payments._sum.amountCents ?? 0;
  const expenseCents = expenses._sum.amountCents ?? 0;
  const retrocessionReceivedCents = retrocessionsReceived._sum.amountCents ?? 0;
  const retrocessionPaidCents = retrocessionsPaid._sum.amountCents ?? 0;

  return {
    incomeCents,
    expenseCents,
    retrocessionReceivedCents,
    retrocessionPaidCents,
    estimatedResultCents:
      incomeCents + retrocessionReceivedCents - expenseCents - retrocessionPaidCents,
  };
}

export async function createDeclarationPeriod(
  cabinetId: string,
  input: CreateDeclarationPeriodInput,
) {
  const session = await requireCabinetPermission(cabinetId, "declarations.manage");
  const data = createDeclarationPeriodSchema.parse(input);
  const periodStart = new Date(data.periodStart);
  const periodEnd = new Date(data.periodEnd);

  if (periodEnd < periodStart) {
    throw new Error("La fin de periode doit etre apres le debut");
  }

  const period = await prisma.declarationPeriod.create({
    data: {
      cabinetId,
      label: data.label,
      periodStart,
      periodEnd,
      notes: data.notes,
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "declaration_period.created",
    resourceType: "DeclarationPeriod",
    resourceId: period.id,
    metadata: { label: period.label },
  });

  return period;
}

export async function lockDeclarationPeriod(cabinetId: string, periodId: string) {
  const session = await requireCabinetPermission(cabinetId, "declarations.manage");
  const period = await prisma.declarationPeriod.update({
    where: { id: periodId, cabinetId },
    data: { status: "LOCKED", lockedAt: new Date() },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "declaration_period.locked",
    resourceType: "DeclarationPeriod",
    resourceId: period.id,
    metadata: { label: period.label },
  });

  return period;
}
