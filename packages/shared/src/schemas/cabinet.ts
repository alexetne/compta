import { z } from "zod";

export const createCabinetSchema = z.object({
  name: z.string().min(2).max(120),
  legalName: z.string().max(160).optional(),
  siret: z.string().max(20).optional(),
  fiscalRegime: z.string().max(80).optional(),
  timezone: z.string().default("Europe/Paris"),
});

export type CreateCabinetInput = z.infer<typeof createCabinetSchema>;
