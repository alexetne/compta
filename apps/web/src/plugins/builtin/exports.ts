import { prisma } from "@/server/db";
import type { AppPlugin } from "../types";

export const exportsPlugin: AppPlugin = {
  id: "admin.exports",
  name: "Exports",
  description: "Exports CSV, comptables et journaux de donnees cabinet.",
  category: "admin",
  status: "enabled",
  defaultEnabled: true,
  navItems: [{ label: "Exports", href: "/exports", status: "Actif", permission: "exports.run" }],
  async getDashboardContribution({ cabinetId }) {
    const exportCount = await prisma.exportJob.count({ where: { cabinetId } });

    return {
      activity: [
        {
          label: "Exports",
          detail: `${exportCount} export(s) genere(s) pour ce cabinet`,
        },
      ],
    };
  },
};
