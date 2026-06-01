import { notFound } from "next/navigation";
import { getEnabledPlugins } from "./installations";

export async function requirePluginEnabled(cabinetId: string, pluginId: string) {
  const plugins = await getEnabledPlugins(cabinetId);

  if (!plugins.some((plugin) => plugin.id === pluginId)) {
    notFound();
  }
}
