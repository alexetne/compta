import { createCabinetSchema, type CreateCabinetInput } from "@shared/index";
import { writeAuditLog } from "../audit";
import { prisma } from "../db";

export async function createCabinet(userId: string, input: CreateCabinetInput) {
  const data = createCabinetSchema.parse(input);

  const cabinet = await prisma.cabinet.create({
    data: {
      name: data.name,
      legalName: data.legalName,
      siret: data.siret,
      fiscalRegime: data.fiscalRegime,
      timezone: data.timezone,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
      categories: {
        create: [
          { name: "Honoraires", type: "INCOME", code: "REC-HON" },
          { name: "Loyer cabinet", type: "EXPENSE", code: "DEP-LOYER" },
          { name: "Logiciels", type: "EXPENSE", code: "DEP-SOFT" },
          { name: "Formation", type: "EXPENSE", code: "DEP-FORM" },
        ],
      },
    },
  });

  await writeAuditLog({
    cabinetId: cabinet.id,
    actorUserId: userId,
    action: "cabinet.created",
    resourceType: "Cabinet",
    resourceId: cabinet.id,
  });

  return cabinet;
}

export async function listUserCabinets(userId: string) {
  return prisma.cabinet.findMany({
    where: {
      members: {
        some: {
          userId,
          active: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}
