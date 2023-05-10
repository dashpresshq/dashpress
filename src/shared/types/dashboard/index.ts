import { IPortalWidgetConfig } from "../portal/widgets";
import { ISharedWidgetConfig } from "./base";

export interface ITableWidgetConfig extends ISharedWidgetConfig {
  _type: "table";
}

export interface ISummaryWidgetConfig extends ISharedWidgetConfig {
  _type: "summary-card";
  icon: string;
  color: string;
}

export type IWidgetConfig =
  | ITableWidgetConfig
  | ISummaryWidgetConfig
  | IPortalWidgetConfig;

export const HOME_DASHBOARD_KEY = "__home__widgets";

export type WidgetSizes = "1" | "2" | "4";
