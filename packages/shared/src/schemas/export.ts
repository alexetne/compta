import { z } from "zod";

export const createExportJobSchema = z.object({
  type: z.enum([
    "payments_csv",
    "invoices_csv",
    "expenses_csv",
    "retrocessions_csv",
    "declaration_summary_csv",
  ]),
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export type CreateExportJobInput = z.infer<typeof createExportJobSchema>;
