import type { IWidgetConfig } from "@/shared/types/dashboard";

import type { IWidgetConfigBag } from "../../types";

export const PORTAL_WIDGET_CONFIG: Partial<
  Record<IWidgetConfig["_type"], IWidgetConfigBag>
> = {};

export const usePortalDashboardTypesOptions = () => {
  return [];
};
