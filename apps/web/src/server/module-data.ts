import { unstable_noStore as noStore } from "next/cache";
import { requirePluginEnabled } from "@/plugins/guards";
import { getOrCreateDevSession } from "./auth";
import { prisma } from "./db";

const moneyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function formatCents(value: number) {
  return moneyFormatter.format(value / 100);
}

export async function getPatientsPageData() {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    await requirePluginEnabled(session.cabinetId, "care.patients");
    const patients = await prisma.patient.findMany({
      where: { cabinetId: session.cabinetId, deletedAt: null },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      take: 50,
    });

    return { databaseReady: true, patients };
  } catch {
    return { databaseReady: false, patients: [] };
  }
}

export async function getServiceItemsPageData() {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    await requirePluginEnabled(session.cabinetId, "cabinet.service-items");
    const serviceItems = await prisma.serviceItem.findMany({
      where: { cabinetId: session.cabinetId, active: true },
      orderBy: { name: "asc" },
      take: 50,
    });

    return {
      databaseReady: true,
      serviceItems: serviceItems.map((item) => ({
        ...item,
        formattedAmount: formatCents(item.defaultAmountCents),
      })),
    };
  } catch {
    return { databaseReady: false, serviceItems: [] };
  }
}

export async function getExpensesPageData() {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    await requirePluginEnabled(session.cabinetId, "finance.accounting");
    const expenses = await prisma.expense.findMany({
      where: { cabinetId: session.cabinetId },
      orderBy: { expenseDate: "desc" },
      take: 50,
    });

    return {
      databaseReady: true,
      expenses: expenses.map((expense) => ({
        ...expense,
        formattedAmount: formatCents(expense.amountCents),
      })),
    };
  } catch {
    return { databaseReady: false, expenses: [] };
  }
}

export async function getInvoicesPageData() {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    await requirePluginEnabled(session.cabinetId, "billing.invoices");
    const [invoices, patients, serviceItems] = await Promise.all([
      prisma.invoice.findMany({
        where: { cabinetId: session.cabinetId },
        include: {
          patient: true,
          lines: true,
          payments: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: 100,
      }),
      prisma.patient.findMany({
        where: { cabinetId: session.cabinetId, deletedAt: null },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        take: 100,
      }),
      prisma.serviceItem.findMany({
        where: { cabinetId: session.cabinetId, active: true },
        orderBy: { name: "asc" },
        take: 100,
      }),
    ]);

    return {
      databaseReady: true,
      patients,
      serviceItems,
      invoices: invoices.map((invoice) => {
        const paidCents = invoice.payments.reduce(
          (total, payment) => total + payment.amountCents,
          0,
        );

        return {
          ...invoice,
          paidCents,
          formattedTotal: formatCents(invoice.totalCents),
          formattedPaid: formatCents(paidCents),
        };
      }),
    };
  } catch {
    return { databaseReady: false, patients: [], serviceItems: [], invoices: [] };
  }
}

export async function getPaymentsPageData() {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    await requirePluginEnabled(session.cabinetId, "finance.payments");
    const [payments, invoices] = await Promise.all([
      prisma.payment.findMany({
        where: { cabinetId: session.cabinetId },
        include: { invoice: { include: { patient: true } } },
        orderBy: { paidAt: "desc" },
        take: 100,
      }),
      prisma.invoice.findMany({
        where: {
          cabinetId: session.cabinetId,
          status: { in: ["ISSUED", "PARTIALLY_PAID"] },
        },
        include: { patient: true, payments: true },
        orderBy: { issuedAt: "desc" },
        take: 100,
      }),
    ]);

    return {
      databaseReady: true,
      payments: payments.map((payment) => ({
        ...payment,
        formattedAmount: formatCents(payment.amountCents),
      })),
      invoices: invoices.map((invoice) => {
        const paidCents = invoice.payments.reduce(
          (total, payment) => total + payment.amountCents,
          0,
        );
        const remainingCents = Math.max(invoice.totalCents - paidCents, 0);

        return {
          ...invoice,
          remainingCents,
          formattedRemaining: formatCents(remainingCents),
        };
      }),
    };
  } catch {
    return { databaseReady: false, payments: [], invoices: [] };
  }
}

export async function getRetrocessionsPageData() {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    await requirePluginEnabled(session.cabinetId, "finance.retrocessions");
    const retrocessions = await prisma.retrocession.findMany({
      where: { cabinetId: session.cabinetId },
      orderBy: [{ periodStart: "desc" }, { createdAt: "desc" }],
      take: 100,
    });

    return {
      databaseReady: true,
      retrocessions: retrocessions.map((retrocession) => ({
        ...retrocession,
        formattedAmount: formatCents(retrocession.amountCents),
      })),
    };
  } catch {
    return { databaseReady: false, retrocessions: [] };
  }
}
