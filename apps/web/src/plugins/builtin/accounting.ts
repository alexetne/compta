import { prisma } from "@/server/db";
import { currentMonthRange, formatCents } from "../utils";
import type { AppPlugin } from "../types";

export const accountingPlugin: AppPlugin = {
  id: "finance.accounting",
  name: "Charges et resultat",
  description: "Charges professionnelles, categories comptables et resultat estime.",
  category: "finance",
  status: "enabled",
  defaultEnabled: true,
  navItems: [
    { label: "Charges", href: "/charges", status: "Actif", permission: "accounting.manage" },
  ],
  async getDashboardContribution({ cabinetId }) {
    const { start, end } = currentMonthRange();
    const [payments, expenses, recentExpenses] = await Promise.all([
      prisma.payment.aggregate({
        where: { cabinetId, paidAt: { gte: start, lt: end } },
        _sum: { amountCents: true },
      }),
      prisma.expense.aggregate({
        where: { cabinetId, expenseDate: { gte: start, lt: end } },
        _sum: { amountCents: true },
      }),
      prisma.expense.findMany({
        where: { cabinetId },
        orderBy: { expenseDate: "desc" },
        take: 3,
        select: { label: true, amountCents: true, expenseDate: true },
      }),
    ]);

    const incomeCents = payments._sum.amountCents ?? 0;
    const expenseCents = expenses._sum.amountCents ?? 0;

    return {
      metrics: [{ label: "Charges saisies", value: formatCents(expenseCents) }],
      rows: [
        { label: "Charges professionnelles", status: "Connecte", amount: formatCents(expenseCents) },
        {
          label: "Resultat estime",
          status: "Calcule",
          amount: formatCents(incomeCents - expenseCents),
        },
      ],
      activity: [
        ...recentExpenses.map((expense) => ({
          label: expense.label,
          detail: `Charge - ${expense.expenseDate.toLocaleDateString("fr-FR")}`,
          amount: formatCents(-expense.amountCents),
        })),
      ],
    };
  },
};
