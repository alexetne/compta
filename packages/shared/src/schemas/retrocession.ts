import { z } from "zod";
import { moneyCentsSchema } from "./finance";

export const createRetrocessionSchema = z.object({
  direction: z.enum(["RECEIVED", "PAID"]),
  status: z.enum(["DRAFT", "DUE", "SETTLED", "CANCELLED"]).default("DUE"),
  label: z.string().min(2).max(160),
  counterparty: z.string().min(2).max(160),
  amountCents: moneyCentsSchema,
  currency: z.string().length(3).default("EUR"),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  settledAt: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateRetrocessionInput = z.infer<typeof createRetrocessionSchema>;
