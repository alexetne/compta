import { createRetrocessionSchema, type CreateRetrocessionInput } from "@shared/index";
import { writeAuditLog } from "../audit";
import { requireCabinetPermission } from "../auth";
import { prisma } from "../db";

export async function createRetrocession(cabinetId: string, input: CreateRetrocessionInput) {
  const session = await requireCabinetPermission(cabinetId, "accounting.manage");
  const data = createRetrocessionSchema.parse(input);

  const retrocession = await prisma.retrocession.create({
    data: {
      cabinetId,
      direction: data.direction,
      status: data.status,
      label: data.label,
      counterparty: data.counterparty,
      amountCents: data.amountCents,
      currency: data.currency,
      periodStart: new Date(data.periodStart),
      periodEnd: new Date(data.periodEnd),
      settledAt: data.settledAt ? new Date(data.settledAt) : undefined,
      notes: data.notes,
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "retrocession.created",
    resourceType: "Retrocession",
    resourceId: retrocession.id,
    metadata: {
      amountCents: retrocession.amountCents,
      direction: retrocession.direction,
      status: retrocession.status,
    },
  });

  return retrocession;
}

export async function listRetrocessions(cabinetId: string) {
  await requireCabinetPermission(cabinetId, "accounting.manage");

  return prisma.retrocession.findMany({
    where: { cabinetId },
    orderBy: [{ periodStart: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
}
