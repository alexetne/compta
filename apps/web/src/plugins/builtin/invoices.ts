import { prisma } from "@/server/db";
import { formatCents } from "../utils";
import type { AppPlugin } from "../types";

export const invoicesPlugin: AppPlugin = {
  id: "billing.invoices",
  name: "Factures",
  description: "Creation, emission, annulation et suivi des factures par cabinet.",
  category: "finance",
  status: "enabled",
  defaultEnabled: true,
  navItems: [{ label: "Factures", href: "/factures", status: "Actif", permission: "billing.manage" }],
  async getDashboardContribution({ cabinetId }) {
    const [unpaidInvoices, draftCount] = await Promise.all([
      prisma.invoice.aggregate({
        where: { cabinetId, status: { in: ["ISSUED", "PARTIALLY_PAID"] } },
        _sum: { totalCents: true },
      }),
      prisma.invoice.count({
        where: { cabinetId, status: "DRAFT" },
      }),
    ]);

    return {
      metrics: [{ label: "Factures impayees", value: formatCents(unpaidInvoices._sum.totalCents ?? 0) }],
      rows: [
        {
          label: "Factures brouillon",
          status: `${draftCount} a emettre`,
          amount: formatCents(0),
        },
      ],
    };
  },
};
