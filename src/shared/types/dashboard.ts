import { QueryFilter } from "shared/types";

export interface ISharedWidgetConfig {
  id: string;
  title: string;
  link?: { title: string; link: string };
  filter: QueryFilter[];
  entity: string;
}

export interface ITableWidgetConfig extends ISharedWidgetConfig {
  _type: "table";
}

export interface ISummaryWidgetConfig extends ISharedWidgetConfig {
  _type: "summary-card";
  svg?: string;
  statusIndicator?: {
    field: string;
    period: "day" | "week" | "month" | "quarter" | "year";
  };
}

export type IWidgetConfig = ITableWidgetConfig | ISummaryWidgetConfig;

export const HOME_DASHBOARD_KEY = "__home__";
