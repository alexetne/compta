import { prisma } from "@/server/db";
import { formatCents } from "../utils";
import type { AppPlugin } from "../types";

export const patientsPlugin: AppPlugin = {
  id: "care.patients",
  name: "Patients",
  description: "Fiches administratives patients et recherche cabinet.",
  category: "care",
  status: "enabled",
  defaultEnabled: true,
  navItems: [{ label: "Patients", href: "/patients", status: "Actif", permission: "patients.read" }],
  async getDashboardContribution({ cabinetId }) {
    const activePatients = await prisma.patient.count({
      where: { cabinetId, active: true, deletedAt: null },
    });

    return {
      metrics: [{ label: "Patients actifs", value: String(activePatients) }],
      activity: [
        {
          label: "Patients",
          detail: `${activePatients} fiche(s) active(s) dans ce cabinet`,
          amount: formatCents(0),
        },
      ],
    };
  },
};
