const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function startOfCurrentMonth() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function addMinutes(date, minutes) {
  const next = new Date(date);
  next.setUTCMinutes(next.getUTCMinutes() + minutes);
  return next;
}

const defaultPluginIds = [
  "core.cabinet",
  "care.patients",
  "care.appointments",
  "cabinet.service-items",
  "finance.accounting",
  "admin.declarations",
  "admin.exports",
];

async function main() {
  const monthStart = startOfCurrentMonth();

  const user = await prisma.user.upsert({
    where: { email: "owner@cabinet.local" },
    update: { name: "Cabinet Owner" },
    create: {
      email: "owner@cabinet.local",
      name: "Cabinet Owner",
    },
  });

  let cabinet = await prisma.cabinet.findFirst({
    where: {
      members: {
        some: { userId: user.id },
      },
    },
  });

  if (!cabinet) {
    cabinet = await prisma.cabinet.create({
      data: {
        name: "Cabinet demo",
        legalName: "Cabinet demo",
        fiscalRegime: "BNC",
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });
  }

  await Promise.all(
    defaultPluginIds.map((pluginId) =>
      prisma.pluginInstallation.upsert({
        where: {
          cabinetId_pluginId: {
            cabinetId: cabinet.id,
            pluginId,
          },
        },
        update: { enabled: true },
        create: {
          cabinetId: cabinet.id,
          pluginId,
          enabled: true,
        },
      }),
    ),
  );

  const honoraires = await prisma.accountingCategory.upsert({
    where: {
      cabinetId_name_type: {
        cabinetId: cabinet.id,
        name: "Honoraires",
        type: "INCOME",
      },
    },
    update: {},
    create: {
      cabinetId: cabinet.id,
      name: "Honoraires",
      type: "INCOME",
      code: "REC-HON",
    },
  });

  const loyer = await prisma.accountingCategory.upsert({
    where: {
      cabinetId_name_type: {
        cabinetId: cabinet.id,
        name: "Loyer cabinet",
        type: "EXPENSE",
      },
    },
    update: {},
    create: {
      cabinetId: cabinet.id,
      name: "Loyer cabinet",
      type: "EXPENSE",
      code: "DEP-LOYER",
    },
  });

  const logiciel = await prisma.accountingCategory.upsert({
    where: {
      cabinetId_name_type: {
        cabinetId: cabinet.id,
        name: "Logiciels",
        type: "EXPENSE",
      },
    },
    update: {},
    create: {
      cabinetId: cabinet.id,
      name: "Logiciels",
      type: "EXPENSE",
      code: "DEP-SOFT",
    },
  });

  const consultation = await prisma.serviceItem.upsert({
    where: {
      id: "seed_consultation",
    },
    update: {
      cabinetId: cabinet.id,
      accountingCategoryId: honoraires.id,
    },
    create: {
      id: "seed_consultation",
      cabinetId: cabinet.id,
      accountingCategoryId: honoraires.id,
      name: "Consultation",
      defaultDurationMin: 45,
      defaultAmountCents: 6000,
    },
  });

  const bilan = await prisma.serviceItem.upsert({
    where: {
      id: "seed_bilan",
    },
    update: {
      cabinetId: cabinet.id,
      accountingCategoryId: honoraires.id,
    },
    create: {
      id: "seed_bilan",
      cabinetId: cabinet.id,
      accountingCategoryId: honoraires.id,
      name: "Bilan initial",
      defaultDurationMin: 60,
      defaultAmountCents: 8500,
    },
  });

  const patient = await prisma.patient.upsert({
    where: { id: "seed_patient_camille" },
    update: { cabinetId: cabinet.id },
    create: {
      id: "seed_patient_camille",
      cabinetId: cabinet.id,
      firstName: "Camille",
      lastName: "Martin",
      email: "camille.martin@example.com",
      phone: "+33600000000",
    },
  });

  const invoice = await prisma.invoice.upsert({
    where: {
      cabinetId_invoiceNumber: {
        cabinetId: cabinet.id,
        invoiceNumber: "2026-0001",
      },
    },
    update: {},
    create: {
      cabinetId: cabinet.id,
      patientId: patient.id,
      invoiceNumber: "2026-0001",
      status: "PAID",
      issuedAt: addDays(monthStart, 2),
      dueAt: addDays(monthStart, 17),
      totalCents: 14500,
      lines: {
        create: [
          {
            serviceItemId: bilan.id,
            label: "Bilan initial",
            quantity: 1,
            unitCents: 8500,
            totalCents: 8500,
          },
          {
            serviceItemId: consultation.id,
            label: "Consultation",
            quantity: 1,
            unitCents: 6000,
            totalCents: 6000,
          },
        ],
      },
    },
  });

  await prisma.payment.upsert({
    where: { id: "seed_payment_1" },
    update: { cabinetId: cabinet.id, invoiceId: invoice.id },
    create: {
      id: "seed_payment_1",
      cabinetId: cabinet.id,
      invoiceId: invoice.id,
      amountCents: 14500,
      paidAt: addDays(monthStart, 4),
      method: "CARD",
    },
  });

  await prisma.expense.upsert({
    where: { id: "seed_expense_rent" },
    update: { cabinetId: cabinet.id, accountingCategoryId: loyer.id },
    create: {
      id: "seed_expense_rent",
      cabinetId: cabinet.id,
      accountingCategoryId: loyer.id,
      label: "Loyer cabinet",
      amountCents: 75000,
      expenseDate: addDays(monthStart, 1),
      supplier: "SCI Cabinet",
    },
  });

  await prisma.expense.upsert({
    where: { id: "seed_expense_software" },
    update: { cabinetId: cabinet.id, accountingCategoryId: logiciel.id },
    create: {
      id: "seed_expense_software",
      cabinetId: cabinet.id,
      accountingCategoryId: logiciel.id,
      label: "Logiciel metier",
      amountCents: 3900,
      expenseDate: addDays(monthStart, 3),
      supplier: "SaaS",
    },
  });

  await prisma.appointment.upsert({
    where: { id: "seed_appointment_1" },
    update: { cabinetId: cabinet.id, patientId: patient.id, practitionerId: user.id },
    create: {
      id: "seed_appointment_1",
      cabinetId: cabinet.id,
      patientId: patient.id,
      practitionerId: user.id,
      serviceItemId: consultation.id,
      startsAt: addDays(monthStart, 4),
      endsAt: addMinutes(addDays(monthStart, 4), 45),
      status: "COMPLETED",
    },
  });

  await prisma.auditLog.create({
    data: {
      cabinetId: cabinet.id,
      actorUserId: user.id,
      action: "seed.completed",
      resourceType: "Cabinet",
      resourceId: cabinet.id,
    },
  });

  console.log(`Seed termine pour ${cabinet.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
