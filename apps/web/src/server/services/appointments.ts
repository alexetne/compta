import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  type CreateAppointmentInput,
  type UpdateAppointmentStatusInput,
} from "@shared/index";
import { writeAuditLog } from "../audit";
import { requireCabinetPermission } from "../auth";
import { prisma } from "../db";

export async function createAppointment(cabinetId: string, input: CreateAppointmentInput) {
  const session = await requireCabinetPermission(cabinetId, "appointments.manage");
  const data = createAppointmentSchema.parse(input);
  const startsAt = new Date(data.startsAt);
  const endsAt = new Date(data.endsAt);

  if (endsAt <= startsAt) {
    throw new Error("La fin du rendez-vous doit etre apres le debut");
  }

  const appointment = await prisma.appointment.create({
    data: {
      cabinetId,
      patientId: data.patientId,
      practitionerId: data.practitionerId ?? session.user.id,
      serviceItemId: data.serviceItemId,
      startsAt,
      endsAt,
      status: data.status,
      notes: data.notes,
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "appointment.created",
    resourceType: "Appointment",
    resourceId: appointment.id,
    metadata: { status: appointment.status, startsAt: appointment.startsAt.toISOString() },
  });

  return appointment;
}

export async function updateAppointmentStatus(
  cabinetId: string,
  appointmentId: string,
  input: UpdateAppointmentStatusInput,
) {
  const session = await requireCabinetPermission(cabinetId, "appointments.manage");
  const data = updateAppointmentStatusSchema.parse(input);

  const appointment = await prisma.appointment.update({
    where: { id: appointmentId, cabinetId },
    data: { status: data.status },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "appointment.status_updated",
    resourceType: "Appointment",
    resourceId: appointment.id,
    metadata: { status: appointment.status },
  });

  return appointment;
}
