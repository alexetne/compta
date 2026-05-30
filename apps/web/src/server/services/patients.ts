import { createPatientSchema, type CreatePatientInput } from "@shared/index";
import { writeAuditLog } from "../audit";
import { prisma } from "../db";
import { requireCabinetPermission } from "../auth";

export async function createPatient(cabinetId: string, input: CreatePatientInput) {
  const session = await requireCabinetPermission(cabinetId, "patients.write");
  const data = createPatientSchema.parse(input);

  const patient = await prisma.patient.create({
    data: {
      cabinetId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      administrativeNotes: data.administrativeNotes,
    },
  });

  await writeAuditLog({
    cabinetId,
    actorUserId: session.user.id,
    action: "patient.created",
    resourceType: "Patient",
    resourceId: patient.id,
  });

  return patient;
}

export async function listPatients(cabinetId: string, search?: string) {
  await requireCabinetPermission(cabinetId, "patients.read");

  return prisma.patient.findMany({
    where: {
      cabinetId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 50,
  });
}
