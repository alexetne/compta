import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./db";
import { getOrCreateDevSession } from "./auth";

export type DashboardMetric = {
  label: string;
  value: string;
};

export type DashboardRow = {
  label: string;
  status: string;
  amount: string;
};

export type DashboardModule = {
  label: string;
  href: string;
  status: string;
};

export type DashboardActivity = {
  label: string;
  detail: string;
  amount?: string;
};

export type DashboardViewModel = {
  cabinetName: string;
  periodLabel: string;
  metrics: DashboardMetric[];
  rows: DashboardRow[];
  modules: DashboardModule[];
  activity: DashboardActivity[];
  databaseReady: boolean;
};

const modules = [
  { label: "Cabinet", href: "/", status: "Socle" },
  { label: "Patients", href: "/patients", status: "En cours" },
  { label: "Agenda", href: "/agenda", status: "A faire" },
  { label: "Prestations", href: "/prestations", status: "En cours" },
  { label: "Factures", href: "/factures", status: "A faire" },
  { label: "Paiements", href: "/paiements", status: "Service pret" },
  { label: "Charges", href: "/charges", status: "Service pret" },
  { label: "Declarations", href: "/declarations", status: "A faire" },
  { label: "Exports", href: "/exports", status: "A faire" },
  { label: "Audit", href: "/audit", status: "Socle" },
];

const moneyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function formatCents(value: number) {
  return moneyFormatter.format(value / 100);
}

function currentMonthRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return { start, end };
}

export async function getDashboardViewModel(): Promise<DashboardViewModel> {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    const { start, end } = currentMonthRange();

    const cabinet = await prisma.cabinet.findUniqueOrThrow({
      where: { id: session.cabinetId },
      select: { name: true },
    });

    const [payments, expenses, unpaidInvoices, completedAppointments, recentPayments, recentExpenses] =
      await Promise.all([
      prisma.payment.aggregate({
        where: {
          cabinetId: session.cabinetId,
          paidAt: { gte: start, lt: end },
        },
        _sum: { amountCents: true },
      }),
      prisma.expense.aggregate({
        where: {
          cabinetId: session.cabinetId,
          expenseDate: { gte: start, lt: end },
        },
        _sum: { amountCents: true },
      }),
      prisma.invoice.aggregate({
        where: {
          cabinetId: session.cabinetId,
          status: { in: ["ISSUED", "PARTIALLY_PAID"] },
        },
        _sum: { totalCents: true },
      }),
      prisma.appointment.count({
        where: {
          cabinetId: session.cabinetId,
          status: "COMPLETED",
          startsAt: { gte: start, lt: end },
        },
      }),
      prisma.payment.findMany({
        where: { cabinetId: session.cabinetId },
        orderBy: { paidAt: "desc" },
        take: 3,
        select: { amountCents: true, paidAt: true, method: true },
      }),
      prisma.expense.findMany({
        where: { cabinetId: session.cabinetId },
        orderBy: { expenseDate: "desc" },
        take: 3,
        select: { label: true, amountCents: true, expenseDate: true },
      }),
    ]);

    const incomeCents = payments._sum.amountCents ?? 0;
    const expenseCents = expenses._sum.amountCents ?? 0;
    const unpaidCents = unpaidInvoices._sum.totalCents ?? 0;

    return {
      cabinetName: cabinet.name,
      periodLabel: start.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      modules,
      databaseReady: true,
      metrics: [
        { label: "Revenus encaisses", value: formatCents(incomeCents) },
        { label: "Factures impayees", value: formatCents(unpaidCents) },
        { label: "Rendez-vous ce mois", value: String(completedAppointments) },
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
      ].slice(0, 5),
    };
  } catch {
    return {
      cabinetName: "Cabinet demo",
      periodLabel: "mode local",
      modules,
      databaseReady: false,
      metrics: [
        { label: "Revenus encaisses", value: "0,00 EUR" },
        { label: "Factures impayees", value: "0,00 EUR" },
        { label: "Rendez-vous ce mois", value: "0" },
        { label: "Charges saisies", value: "0,00 EUR" },
      ],
      rows: [
        { label: "Honoraires encaisses", status: "BDD a connecter", amount: "0,00 EUR" },
        { label: "Charges professionnelles", status: "BDD a connecter", amount: "0,00 EUR" },
        { label: "Resultat estime", status: "BDD a connecter", amount: "0,00 EUR" },
      ],
      activity: [
        {
          label: "Base de donnees",
          detail: "Lance Docker, les migrations et le seed pour activer les donnees demo.",
        },
      ],
    };
  }
}
