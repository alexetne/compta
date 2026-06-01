import { z } from "zod";

export const createDeclarationPeriodSchema = z.object({
  label: z.string().min(2).max(120),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

export type CreateDeclarationPeriodInput = z.infer<typeof createDeclarationPeriodSchema>;
