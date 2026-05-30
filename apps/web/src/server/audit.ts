import type { Prisma } from "@prisma/client";
import { prisma } from "./db";

type AuditInput = {
  cabinetId?: string | null;
  actorUserId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function writeAuditLog(input: AuditInput) {
  return prisma.auditLog.create({
    data: {
      cabinetId: input.cabinetId,
      actorUserId: input.actorUserId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      metadata: input.metadata,
    },
  });
}
