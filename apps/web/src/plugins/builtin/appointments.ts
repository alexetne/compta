import { prisma } from "@/server/db";
import { currentMonthRange } from "../utils";
import type { AppPlugin } from "../types";

export const appointmentsPlugin: AppPlugin = {
  id: "care.appointments",
  name: "Agenda",
  description: "Rendez-vous, statuts de seance et planification praticien.",
  category: "care",
  status: "enabled",
  defaultEnabled: true,
  navItems: [
    { label: "Agenda", href: "/agenda", status: "Actif", permission: "appointments.manage" },
  ],
  async getDashboardContribution({ cabinetId }) {
    const { start, end } = currentMonthRange();
    const completedAppointments = await prisma.appointment.count({
      where: {
        cabinetId,
        status: "COMPLETED",
        startsAt: { gte: start, lt: end },
      },
    });

    return {
      metrics: [{ label: "Rendez-vous ce mois", value: String(completedAppointments) }],
    };
  },
};
