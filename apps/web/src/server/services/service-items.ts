import { createServiceItemSchema, type CreateServiceItemInput } from "@shared/index";
import { writeAuditLog } from "../audit";
import { prisma } from "../db";
import { requireCabinetPermission } from "../auth";

export async function createServiceItem(cabinetId: string, input: CreateServiceItemInput) {
  const session = await requireCabinetPermission(cabinetId, "cabinet.manage");
  const data = createServiceItemSchema.parse(input);

  const serviceItem = await prisma.serviceItem.create({
    data: {
      cabinetId,
      accountingCategoryId: data.accountingCategoryId,
      name: data.name,
      description: data.description,
      defaultDurationMin: data.defaultDurationMin,
      defaultAmountCents: data.defaultAmountCents,
      currency: data.currency,
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "service_item.created",
    resourceType: "ServiceItem",
    resourceId: serviceItem.id,
  });

  return serviceItem;
}

export async function listServiceItems(cabinetId: string) {
  await requireCabinetPermission(cabinetId, "cabinet.manage");

  return prisma.serviceItem.findMany({
    where: { cabinetId, active: true },
    orderBy: { name: "asc" },
  });
}
