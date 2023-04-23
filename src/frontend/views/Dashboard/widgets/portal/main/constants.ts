import { IWidgetConfig, WidgetSizes } from "shared/types/dashboard";

export const PORTAL_WIDGET_SIZES: Partial<
  Record<IWidgetConfig["_type"], { size: WidgetSizes; height?: number }>
> = {};

export const PortalDashboardTypesOptions: {
  label: string;
  value: IWidgetConfig["_type"];
}[] = [];