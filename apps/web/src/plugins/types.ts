import type { Permission } from "@/server/permissions";

export type PluginStatus = "core" | "enabled" | "available" | "planned";

export type PluginNavItem = {
  label: string;
  href: string;
  status: string;
  permission?: Permission;
};

export type PluginDashboardMetric = {
  label: string;
  value: string;
};

export type PluginDashboardRow = {
  label: string;
  status: string;
  amount: string;
};

export type PluginActivityItem = {
  label: string;
  detail: string;
  amount?: string;
};

export type PluginDashboardContribution = {
  metrics?: PluginDashboardMetric[];
  rows?: PluginDashboardRow[];
  activity?: PluginActivityItem[];
};

export type PluginContext = {
  cabinetId: string;
  userId: string;
};

export type AppPlugin = {
  id: string;
  name: string;
  description: string;
  category: "core" | "cabinet" | "finance" | "care" | "admin";
  status: PluginStatus;
  defaultEnabled: boolean;
  requiredPermissions?: Permission[];
  navItems?: PluginNavItem[];
  getDashboardContribution?: (
    context: PluginContext,
  ) => Promise<PluginDashboardContribution>;
};
