import type { CabinetRole } from "@prisma/client";

export type Permission =
  | "cabinet.manage"
  | "users.manage"
  | "patients.read"
  | "patients.write"
  | "appointments.manage"
  | "billing.manage"
  | "accounting.manage"
  | "declarations.manage"
  | "exports.run"
  | "audit.read";

const rolePermissions: Record<CabinetRole, Permission[]> = {
  OWNER: [
    "cabinet.manage",
    "users.manage",
    "patients.read",
    "patients.write",
    "appointments.manage",
    "billing.manage",
    "accounting.manage",
    "declarations.manage",
    "exports.run",
    "audit.read",
  ],
  ADMIN: [
    "cabinet.manage",
    "users.manage",
    "patients.read",
    "patients.write",
    "appointments.manage",
    "billing.manage",
    "accounting.manage",
    "declarations.manage",
    "exports.run",
    "audit.read",
  ],
  PRACTITIONER: [
    "patients.read",
    "patients.write",
    "appointments.manage",
    "billing.manage",
    "accounting.manage",
    "exports.run",
  ],
  ASSISTANT: ["patients.read", "patients.write", "appointments.manage", "billing.manage"],
  ACCOUNTANT: ["accounting.manage", "declarations.manage", "exports.run", "audit.read"],
};

export function hasPermission(role: CabinetRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export class ForbiddenError extends Error {
  constructor(message = "Action non autorisee") {
    super(message);
    this.name = "ForbiddenError";
  }
}
