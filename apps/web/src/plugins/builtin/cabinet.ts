import type { AppPlugin } from "../types";

export const cabinetPlugin: AppPlugin = {
  id: "core.cabinet",
  name: "Cabinets",
  description: "Gestion des cabinets, membres, roles, lieux et parametres.",
  category: "core",
  status: "core",
  defaultEnabled: true,
  navItems: [{ label: "Cabinet", href: "/", status: "Socle", permission: "cabinet.manage" }],
};
