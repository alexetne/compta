import type { AppPlugin } from "../types";

export const declarationsPlugin: AppPlugin = {
  id: "admin.declarations",
  name: "Declarations",
  description: "Preparation des periodes fiscales et exports de synthese.",
  category: "admin",
  status: "available",
  defaultEnabled: true,
  navItems: [
    { label: "Declarations", href: "/declarations", status: "A faire", permission: "declarations.manage" },
  ],
};
