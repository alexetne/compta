import { unstable_noStore as noStore } from "next/cache";
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
