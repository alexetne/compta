import { prisma } from "@/server/db";
import { currentMonthRange, formatCents } from "../utils";
import type { AppPlugin } from "../types";

export const paymentsPlugin: AppPlugin = {
  id: "finance.payments",
  name: "Paiements",
  description: "Encaissements, moyens de paiement et rapprochement avec les factures.",
  category: "finance",
  status: "enabled",
  defaultEnabled: true,
  navItems: [{ label: "Paiements", href: "/paiements", status: "Actif", permission: "billing.manage" }],
  async getDashboardContribution({ cabinetId }) {
    const { start, end } = currentMonthRange();
    const [payments, recentPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: { cabinetId, paidAt: { gte: start, lt: end } },
        _sum: { amountCents: true },
      }),
      prisma.payment.findMany({
        where: { cabinetId },
        orderBy: { paidAt: "desc" },
        take: 3,
        select: { amountCents: true, paidAt: true, method: true },
      }),
    ]);

    const incomeCents = payments._sum.amountCents ?? 0;

    return {
      metrics: [{ label: "Revenus encaisses", value: formatCents(incomeCents) }],
      rows: [{ label: "Honoraires encaisses", status: "Connecte", amount: formatCents(incomeCents) }],
      activity: recentPayments.map((payment) => ({
        label: "Paiement encaisse",
        detail: `${payment.method} - ${payment.paidAt.toLocaleDateString("fr-FR")}`,
        amount: formatCents(payment.amountCents),
      })),
    };
  },
};
