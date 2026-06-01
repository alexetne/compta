import { z } from "zod";
import { moneyCentsSchema } from "./finance";

export const createInvoiceLineSchema = z.object({
  serviceItemId: z.string().optional(),
  label: z.string().min(2).max(160),
  quantity: z.number().int().min(1).max(999),
  unitCents: moneyCentsSchema,
});

export const createInvoiceSchema = z.object({
  patientId: z.string().optional(),
  issuedAt: z.string().datetime().optional(),
  dueAt: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  lines: z.array(createInvoiceLineSchema).min(1),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type CreateInvoiceLineInput = z.infer<typeof createInvoiceLineSchema>;
