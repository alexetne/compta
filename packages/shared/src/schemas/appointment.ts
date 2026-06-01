import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().optional(),
  practitionerId: z.string().optional(),
  serviceItemId: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"]).default("SCHEDULED"),
  notes: z.string().max(2000).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"]),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
