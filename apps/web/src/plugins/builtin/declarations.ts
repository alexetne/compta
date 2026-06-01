import { prisma } from "@/server/db";
import type { AppPlugin } from "../types";

export const declarationsPlugin: AppPlugin = {
  id: "admin.declarations",
  name: "Declarations",
  description: "Preparation des periodes fiscales et exports de synthese.",
  category: "admin",
  status: "enabled",
  defaultEnabled: true,
  navItems: [
    { label: "Declarations", href: "/declarations", status: "Actif", permission: "declarations.manage" },
  ],
  async getDashboardContribution({ cabinetId }) {
    const [openCount, lockedCount] = await Promise.all([
      prisma.declarationPeriod.count({ where: { cabinetId, status: "OPEN" } }),
      prisma.declarationPeriod.count({ where: { cabinetId, status: "LOCKED" } }),
    ]);

    return {
      rows: [
        {
          label: "Periodes declaratives",
          status: `${openCount} ouvertes`,
          amount: `${lockedCount} verrouillees`,
        },
      ],
    };
  },
};
