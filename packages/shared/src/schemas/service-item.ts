import { z } from "zod";
import { moneyCentsSchema } from "./finance";

export const createServiceItemSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  defaultDurationMin: z.number().int().min(5).max(480).optional(),
  defaultAmountCents: moneyCentsSchema,
  currency: z.string().length(3).default("EUR"),
  accountingCategoryId: z.string().optional(),
});

export type CreateServiceItemInput = z.infer<typeof createServiceItemSchema>;
