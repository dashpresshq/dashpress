import type { FieldQueryFilter, QueryFilterSchema } from "@/shared/types/data";
import { FilterOperators } from "@/shared/types/data";
import { setupAllTestData } from "@/tests/api/setups";

import { RDBMSDataApiService, rDBMSDataApiService } from "../RDBMS";

const filterSchema: FieldQueryFilter[] = [
  {
    id: "equal_field",
    value: {
      operator: FilterOperators.EQUAL_TO,
      value: "_equal",
    },
  },
  {
    id: "is_null",
    value: {
      operator: FilterOperators.IS_NULL,
    },
  },
  {
    id: "is_not_null",
    value: {
      operator: FilterOperators.IS_NOT_NULL,
    },
  },
  {
    id: "less_than",
    value: {
      operator: FilterOperators.LESS_THAN,
      value: "_lessthan",
    },
  },
  {
    id: "greater_than",
    value: {
      operator: FilterOperators.GREATER_THAN,
      value: "_greater_than",
    },
  },
  {
    id: "contains",
    value: {
      operator: FilterOperators.CONTAINS,
      value: "_contains",
    },
  },
  {
    id: "in",
    value: {
      operator: FilterOperators.IN,
      value: ["in1", "in2"],
    },
  },
  {
    id: "not_in",
    value: {
      operator: FilterOperators.NOT_IN,
      value: ["not_in1", "not_in2"],
    },
  },
  {
    id: "not_equal",
    value: {
      operator: FilterOperators.NOT_EQUAL,
      value: "not_equal",
    },
  },
  {
    id: "between",
    value: {
      operator: FilterOperators.BETWEEN,
      value: "btw_1",
      value2: "btw_2",
    },
  },
];

describe("query-generation", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials"]);
  });

  it("should generate correct queries", async () => {
    const query = (await RDBMSDataApiService.getInstance()).from("tests");

    const queryFilters: QueryFilterSchema = {
      operator: "or",
      children: [
        {
          operator: "and",
          children: filterSchema,
        },
        {
          operator: "or",
          children: filterSchema,
        },
      ],
    };
    expect(
      rDBMSDataApiService
        .transformQueryFilterSchema(query, queryFilters)
        .toQuery()
    ).toMatchInlineSnapshot(
      `"select * from \`tests\` where (\`equal_field\` = '_equal' and \`is_null\` is null and \`is_not_null\` is not null and \`less_than\` < '_lessthan' and \`greater_than\` > '_greater_than' and \`contains\` ilike '%_contains%' and \`in\` in ('in1', 'in2') and \`not_in\` not in ('not_in1', 'not_in2') and not \`not_equal\` = 'not_equal' and \`between\` between 'btw_1' and 'btw_2') or (\`equal_field\` = '_equal' or \`is_null\` is null or \`is_not_null\` is not null or \`less_than\` < '_lessthan' or \`greater_than\` > '_greater_than' or \`contains\` ilike '%_contains%' or \`in\` in ('in1', 'in2') or \`not_in\` not in ('not_in1', 'not_in2') or not \`not_equal\` = 'not_equal' or \`between\` between 'btw_1' and 'btw_2')"`
    );
  });
});
