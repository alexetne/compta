import { unstable_noStore as noStore } from "next/cache";
import { getEnabledPlugins } from "@/plugins/installations";
import type {
  PluginActivityItem,
  PluginDashboardMetric,
  PluginDashboardRow,
  PluginNavItem,
} from "@/plugins/types";
import { currentMonthRange } from "@/plugins/utils";
import { getOrCreateDevSession } from "./auth";
import { prisma } from "./db";

export type DashboardViewModel = {
  cabinetName: string;
  periodLabel: string;
  metrics: PluginDashboardMetric[];
  rows: PluginDashboardRow[];
  modules: PluginNavItem[];
  activity: PluginActivityItem[];
  databaseReady: boolean;
};

const fallbackModules: PluginNavItem[] = [
  { label: "Cabinet", href: "/", status: "Socle" },
  { label: "Plugins", href: "/plugins", status: "Noyau" },
];

export async function getDashboardViewModel(): Promise<DashboardViewModel> {
  noStore();

  try {
    const session = await getOrCreateDevSession();
    const { start } = currentMonthRange();

    const cabinet = await prisma.cabinet.findUniqueOrThrow({
      where: { id: session.cabinetId },
      select: { name: true },
    });

    const plugins = await getEnabledPlugins(session.cabinetId);
    const pluginContext = { cabinetId: session.cabinetId, userId: session.user.id };
    const contributions = await Promise.all(
      plugins
        .filter((plugin) => plugin.getDashboardContribution)
        .map((plugin) => plugin.getDashboardContribution?.(pluginContext)),
    );

    const modules = plugins.flatMap((plugin) => plugin.navItems ?? []);
    const metrics = contributions.flatMap((contribution) => contribution?.metrics ?? []);
    const rows = contributions.flatMap((contribution) => contribution?.rows ?? []);
    const activity = contributions.flatMap((contribution) => contribution?.activity ?? []);

    return {
      cabinetName: cabinet.name,
      periodLabel: start.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      modules: [
        ...modules,
        { label: "Plugins", href: "/plugins", status: `${plugins.length} actifs` },
      ],
      databaseReady: true,
      metrics:
        metrics.length > 0
          ? metrics
          : [{ label: "Plugins actifs", value: String(plugins.length) }],
      rows:
        rows.length > 0
          ? rows
          : [{ label: "Noyau applicatif", status: "Pret", amount: `${plugins.length} plugins` }],
      activity:
        activity.length > 0
          ? activity.slice(0, 5)
          : [
              {
                label: "Plugins",
                detail: "Active les modules necessaires depuis le catalogue.",
              },
            ],
    };
  } catch {
    return {
      cabinetName: "Cabinet demo",
      periodLabel: "mode local",
      modules: fallbackModules,
      databaseReady: false,
      metrics: [{ label: "Plugins actifs", value: "0" }],
      rows: [{ label: "Noyau applicatif", status: "BDD a connecter", amount: "0 plugin" }],
      activity: [
        {
          label: "Base de donnees",
          detail: "Lance Docker, les migrations et le seed pour activer le registre de plugins.",
        },
      ],
    };
  }
}
