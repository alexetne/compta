import type { AppPlugin } from "../types";

export const exportsPlugin: AppPlugin = {
  id: "admin.exports",
  name: "Exports",
  description: "Exports CSV, comptables et journaux de donnees cabinet.",
  category: "admin",
  status: "available",
  defaultEnabled: true,
  navItems: [{ label: "Exports", href: "/exports", status: "A faire", permission: "exports.run" }],
};
