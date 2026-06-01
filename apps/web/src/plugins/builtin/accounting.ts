import { prisma } from "@/server/db";
import { currentMonthRange, formatCents } from "../utils";
import type { AppPlugin } from "../types";

export const accountingPlugin: AppPlugin = {
  id: "finance.accounting",
  name: "Revenus et charges",
  description: "Paiements, recettes encaissees, charges et resultat estime.",
  category: "finance",
  status: "enabled",
  defaultEnabled: true,
  navItems: [
    { label: "Paiements", href: "/paiements", status: "Service pret", permission: "billing.manage" },
    { label: "Charges", href: "/charges", status: "Actif", permission: "accounting.manage" },
    { label: "Factures", href: "/factures", status: "A faire", permission: "billing.manage" },
  ],
  async getDashboardContribution({ cabinetId }) {
    const { start, end } = currentMonthRange();
    const [payments, expenses, unpaidInvoices, recentPayments, recentExpenses] = await Promise.all([
      prisma.payment.aggregate({
        where: { cabinetId, paidAt: { gte: start, lt: end } },
        _sum: { amountCents: true },
      }),
      prisma.expense.aggregate({
        where: { cabinetId, expenseDate: { gte: start, lt: end } },
        _sum: { amountCents: true },
      }),
      prisma.invoice.aggregate({
        where: { cabinetId, status: { in: ["ISSUED", "PARTIALLY_PAID"] } },
        _sum: { totalCents: true },
      }),
      prisma.payment.findMany({
        where: { cabinetId },
        orderBy: { paidAt: "desc" },
        take: 3,
        select: { amountCents: true, paidAt: true, method: true },
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
    const unpaidCents = unpaidInvoices._sum.totalCents ?? 0;

    return {
      metrics: [
        { label: "Revenus encaisses", value: formatCents(incomeCents) },
        { label: "Factures impayees", value: formatCents(unpaidCents) },
        { label: "Charges saisies", value: formatCents(expenseCents) },
      ],
      rows: [
        { label: "Honoraires encaisses", status: "Connecte", amount: formatCents(incomeCents) },
        { label: "Charges professionnelles", status: "Connecte", amount: formatCents(expenseCents) },
        {
          label: "Resultat estime",
          status: "Calcule",
          amount: formatCents(incomeCents - expenseCents),
        },
      ],
      activity: [
        ...recentPayments.map((payment) => ({
          label: "Paiement encaisse",
          detail: `${payment.method} - ${payment.paidAt.toLocaleDateString("fr-FR")}`,
          amount: formatCents(payment.amountCents),
        })),
        ...recentExpenses.map((expense) => ({
          label: expense.label,
          detail: `Charge - ${expense.expenseDate.toLocaleDateString("fr-FR")}`,
          amount: formatCents(-expense.amountCents),
        })),
      ],
    };
  },
};
