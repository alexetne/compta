import { prisma } from "@/server/db";
import { getDefaultEnabledPluginIds, getPluginById, pluginRegistry } from "./registry";
import type { AppPlugin } from "./types";

export async function ensureDefaultPluginsInstalled(cabinetId: string) {
  const pluginIds = getDefaultEnabledPluginIds();

  await Promise.all(
    pluginIds.map((pluginId) =>
      prisma.pluginInstallation.upsert({
        where: { cabinetId_pluginId: { cabinetId, pluginId } },
        update: {},
        create: { cabinetId, pluginId, enabled: true },
      }),
    ),
  );
}

export async function getEnabledPlugins(cabinetId: string): Promise<AppPlugin[]> {
  const installations = await prisma.pluginInstallation.findMany({
    where: { cabinetId, enabled: true },
    select: { pluginId: true },
  });

  const installedIds = new Set(installations.map((installation) => installation.pluginId));
  const enabledPlugins = pluginRegistry.filter(
    (plugin) => plugin.status === "core" || installedIds.has(plugin.id),
  );

  return enabledPlugins;
}

export async function getPluginCatalog(cabinetId: string) {
  const installations = await prisma.pluginInstallation.findMany({
    where: { cabinetId },
    select: { pluginId: true, enabled: true },
  });
  const installationByPlugin = new Map(
    installations.map((installation) => [installation.pluginId, installation.enabled]),
  );

  return pluginRegistry.map((plugin) => ({
    ...plugin,
    enabled: plugin.status === "core" || installationByPlugin.get(plugin.id) === true,
    installed: plugin.status === "core" || installationByPlugin.has(plugin.id),
  }));
}

export async function setPluginEnabled(cabinetId: string, pluginId: string, enabled: boolean) {
  const plugin = getPluginById(pluginId);

  if (!plugin || plugin.status === "core") {
    throw new Error("Plugin non configurable");
  }

  await prisma.pluginInstallation.upsert({
    where: { cabinetId_pluginId: { cabinetId, pluginId } },
    update: { enabled },
    create: { cabinetId, pluginId, enabled },
  });
}
