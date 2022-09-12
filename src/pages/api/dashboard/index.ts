/*

// List Dashboard

List Dashboard Items
Delete Dashboard Item
Update Dasbboard Item
New Dashboard Item
Sort Dashboard
*/

import { QueryFilter } from "shared/types";

const schema: Record<
  string,
  {
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
  }[]
> = {
  home: [
    {
      title: "Deal Images",
      svg: "foo",
      config: { _type: "summary-card", model: "users", statusIndicator: false },
    },
  ],
};

console.log(schema);
