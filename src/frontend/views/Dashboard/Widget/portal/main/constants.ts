import { IWidgetConfig } from "shared/types/dashboard";
import { IWidgetConfigBag } from "../../types";

export const PORTAL_WIDGET_CONFIG: Partial<
  Record<IWidgetConfig["_type"], IWidgetConfigBag>
> = {};
