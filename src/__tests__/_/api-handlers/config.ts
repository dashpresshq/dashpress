import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const configApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/config/entity_diction/:entity"),
    async (req, res, ctx) => {
      return res(
        ctx.json({
          singular: `Singular ${req.params.entity}`,
          plural: `Plural ${req.params.entity}`,
        })
      );
    }
  ),
];
