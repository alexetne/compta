import type { AppPlugin } from "../types";

export const retrocessionsPlugin: AppPlugin = {
  id: "finance.retrocessions",
  name: "Retrocessions",
  description: "Gestion des retrocessions recues, versees, remplacants et collaborateurs.",
  category: "finance",
  status: "planned",
  defaultEnabled: false,
  navItems: [
    {
      label: "Retrocessions",
      href: "/retrocessions",
      status: "Plugin dispo plus tard",
      permission: "accounting.manage",
    },
  ],
};
