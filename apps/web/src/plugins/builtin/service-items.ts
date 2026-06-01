import type { AppPlugin } from "../types";

export const serviceItemsPlugin: AppPlugin = {
  id: "cabinet.service-items",
  name: "Prestations",
  description: "Catalogue des actes, durees, tarifs et categories de revenus.",
  category: "cabinet",
  status: "enabled",
  defaultEnabled: true,
  navItems: [
    { label: "Prestations", href: "/prestations", status: "Actif", permission: "cabinet.manage" },
  ],
};
