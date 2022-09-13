import { QueryFilter } from "shared/types";

export interface IDashboardConfig {
  id: string;
  title: string;
  svg?: string;
  config:
    | { _type: "table"; model: string; filter: QueryFilter[] }
    | {
        _type: "summary-card";
        model: string;
        statusIndicator:
          | false
          | {
              field: string;
              period: "day" | "week" | "month" | "quarter" | "year";
            };
      };
}
