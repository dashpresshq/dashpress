import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const dataApiHandlers = [
  rest.get(BASE_TEST_URL("/api/data/:entity/count"), async (req, res, ctx) => {
    return res(
      ctx.json({
        count: req.params.entity.length,
      })
    );
  }),
];
