import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  birthDate: z.string().datetime().optional(),
  administrativeNotes: z.string().max(2000).optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
