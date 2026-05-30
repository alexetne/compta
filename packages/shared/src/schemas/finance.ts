import { z } from "zod";

export const moneyCentsSchema = z.number().int().min(0);

export const createExpenseSchema = z.object({
  label: z.string().min(2).max(160),
  amountCents: moneyCentsSchema,
  currency: z.string().length(3).default("EUR"),
  expenseDate: z.string().datetime(),
  accountingCategoryId: z.string().optional(),
  supplier: z.string().max(160).optional(),
  notes: z.string().max(2000).optional(),
});

export const createPaymentSchema = z.object({
  invoiceId: z.string().optional(),
  amountCents: moneyCentsSchema,
  currency: z.string().length(3).default("EUR"),
  paidAt: z.string().datetime(),
  method: z.enum(["CASH", "CARD", "CHECK", "BANK_TRANSFER", "THIRD_PARTY", "OTHER"]),
  reference: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
