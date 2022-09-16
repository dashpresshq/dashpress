import { QueryFilter } from "shared/types";

export interface IWidgetConfig {
  id: string;
  title: string;
  svg?: string;
  link?: { title: string; link: string };
  config:
    | { _type: "table"; entity: string; filter: QueryFilter[] }
    | {
        _type: "summary-card";
        filter: QueryFilter[];
        entity: string;
        statusIndicator:
          | false
          | {
              field: string;
              period: "day" | "week" | "month" | "quarter" | "year";
            };
      };
}

export const HOME_DASHBOARD_KEY = "__home__";
