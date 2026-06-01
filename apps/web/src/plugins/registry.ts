import { accountingPlugin } from "./builtin/accounting";
import { appointmentsPlugin } from "./builtin/appointments";
import { cabinetPlugin } from "./builtin/cabinet";
import { declarationsPlugin } from "./builtin/declarations";
import { exportsPlugin } from "./builtin/exports";
import { invoicesPlugin } from "./builtin/invoices";
import { paymentsPlugin } from "./builtin/payments";
import { patientsPlugin } from "./builtin/patients";
import { retrocessionsPlugin } from "./builtin/retrocessions";
import { serviceItemsPlugin } from "./builtin/service-items";
import type { AppPlugin } from "./types";

export const pluginRegistry = [
  cabinetPlugin,
  patientsPlugin,
  appointmentsPlugin,
  serviceItemsPlugin,
  invoicesPlugin,
  paymentsPlugin,
  accountingPlugin,
  declarationsPlugin,
  exportsPlugin,
  retrocessionsPlugin,
] satisfies AppPlugin[];

export type PluginId = (typeof pluginRegistry)[number]["id"];

export function getPluginById(pluginId: string) {
  return pluginRegistry.find((plugin) => plugin.id === pluginId);
}

export function getDefaultEnabledPluginIds() {
  return pluginRegistry.filter((plugin) => plugin.defaultEnabled).map((plugin) => plugin.id);
}
