import type { SpectrumColorTypes } from "@/components/ui/spectrum";

import type { IPortalWidgetConfig } from "../portal/widgets";
import type { ISharedWidgetConfig } from "./base";

export interface ITableWidgetConfig extends ISharedWidgetConfig {
  _type: "table";
}

export interface ISummaryWidgetConfig extends ISharedWidgetConfig {
  _type: "summary-card";
  icon: string;
  color: SpectrumColorTypes;
}

export type IWidgetConfig =
  | ITableWidgetConfig
  | ISummaryWidgetConfig
  | IPortalWidgetConfig;

export const HOME_DASHBOARD_KEY = "__home__widgets";

export const WIDGET_SCRIPT_RELATIVE_TIME_MARKER = "RELATIVE_TIME";
