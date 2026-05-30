import type { CabinetRole, User } from "@prisma/client";
import { prisma } from "./db";
import { ForbiddenError, hasPermission, type Permission } from "./permissions";

export type CabinetSession = {
  user: User;
  cabinetId: string;
  role: CabinetRole;
};

export async function getOrCreateDevSession(): Promise<CabinetSession> {
  const email = process.env.DEV_USER_EMAIL ?? "owner@cabinet.local";
  const name = process.env.DEV_USER_NAME ?? "Cabinet Owner";

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  const existingMembership = await prisma.cabinetMember.findFirst({
    where: { userId: user.id, active: true },
    orderBy: { createdAt: "asc" },
  });

  if (existingMembership) {
    return {
      user,
      cabinetId: existingMembership.cabinetId,
      role: existingMembership.role,
    };
  }

  const cabinet = await prisma.cabinet.create({
    data: {
      name: "Cabinet demo",
      legalName: "Cabinet demo",
      fiscalRegime: "BNC",
      members: {
        create: {
          userId: user.id,
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
      serviceItems: {
        create: [
          {
            name: "Consultation",
            defaultDurationMin: 45,
            defaultAmountCents: 6000,
          },
          {
            name: "Bilan initial",
            defaultDurationMin: 60,
            defaultAmountCents: 8500,
          },
        ],
      },
    },
  });

  return { user, cabinetId: cabinet.id, role: "OWNER" };
}

export async function requireCabinetPermission(cabinetId: string, permission: Permission) {
  const session = await getOrCreateDevSession();

  if (session.cabinetId !== cabinetId || !hasPermission(session.role, permission)) {
    throw new ForbiddenError();
  }

  return session;
}
