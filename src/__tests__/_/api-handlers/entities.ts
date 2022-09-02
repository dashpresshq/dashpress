import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const entitiesApiHandlers = [
  rest.get(BASE_TEST_URL("/api/entities/menu"), async (_, res, ctx) => {
    return res(
      ctx.json([
        {
          value: "entity-1",
          label: "entity-1",
        },
        {
          value: "entity-2",
          label: "entity-2",
        },
        {
          value: "entity-3",
          label: "entity-3",
        },
      ])
    );
  }),
];
