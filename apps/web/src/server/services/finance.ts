import {
  createExpenseSchema,
  createPaymentSchema,
  type CreateExpenseInput,
  type CreatePaymentInput,
} from "@shared/index";
import { writeAuditLog } from "../audit";
import { requireCabinetPermission } from "../auth";
import { prisma } from "../db";

export async function createExpense(cabinetId: string, input: CreateExpenseInput) {
  const session = await requireCabinetPermission(cabinetId, "accounting.manage");
  const data = createExpenseSchema.parse(input);

  const expense = await prisma.expense.create({
    data: {
      cabinetId,
      accountingCategoryId: data.accountingCategoryId,
      label: data.label,
      amountCents: data.amountCents,
      currency: data.currency,
      expenseDate: new Date(data.expenseDate),
      supplier: data.supplier,
      notes: data.notes,
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "expense.created",
    resourceType: "Expense",
    resourceId: expense.id,
    metadata: { amountCents: expense.amountCents },
  });

  return expense;
}

export async function createPayment(cabinetId: string, input: CreatePaymentInput) {
  const session = await requireCabinetPermission(cabinetId, "billing.manage");
  const data = createPaymentSchema.parse(input);

  const payment = await prisma.payment.create({
    data: {
      cabinetId,
      invoiceId: data.invoiceId,
      amountCents: data.amountCents,
      currency: data.currency,
      paidAt: new Date(data.paidAt),
      method: data.method,
      reference: data.reference,
      notes: data.notes,
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "payment.created",
    resourceType: "Payment",
    resourceId: payment.id,
    metadata: { amountCents: payment.amountCents, method: payment.method },
  });

  return payment;
}
