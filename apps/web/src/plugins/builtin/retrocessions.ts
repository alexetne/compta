import type { AppPlugin } from "../types";
import { prisma } from "@/server/db";
import { currentMonthRange, formatCents } from "../utils";

export const retrocessionsPlugin: AppPlugin = {
  id: "finance.retrocessions",
  name: "Retrocessions",
  description: "Gestion des retrocessions recues, versees, remplacants et collaborateurs.",
  category: "finance",
  status: "available",
  defaultEnabled: false,
  navItems: [
    {
      label: "Retrocessions",
      href: "/retrocessions",
      status: "Plugin",
      permission: "accounting.manage",
    },
  ],
  async getDashboardContribution({ cabinetId }) {
    const { start, end } = currentMonthRange();
    const [received, paid, dueCount] = await Promise.all([
      prisma.retrocession.aggregate({
        where: {
          cabinetId,
          direction: "RECEIVED",
          periodStart: { lt: end },
          periodEnd: { gte: start },
          status: { not: "CANCELLED" },
        },
        _sum: { amountCents: true },
      }),
      prisma.retrocession.aggregate({
        where: {
          cabinetId,
          direction: "PAID",
          periodStart: { lt: end },
          periodEnd: { gte: start },
          status: { not: "CANCELLED" },
        },
        _sum: { amountCents: true },
      }),
      prisma.retrocession.count({
        where: {
          cabinetId,
          status: "DUE",
        },
      }),
    ]);

    const receivedCents = received._sum.amountCents ?? 0;
    const paidCents = paid._sum.amountCents ?? 0;

    return {
      metrics: [
        { label: "Retrocessions recues", value: formatCents(receivedCents) },
        { label: "Retrocessions versees", value: formatCents(paidCents) },
      ],
      rows: [
        {
          label: "Solde retrocessions",
          status: `${dueCount} a regler`,
          amount: formatCents(receivedCents - paidCents),
        },
      ],
    };
  },
};
