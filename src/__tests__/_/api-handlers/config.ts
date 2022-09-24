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
  rest.get(
    BASE_TEST_URL("/api/config/theme_color/__guest"),
    async (_, res, ctx) => {
      return res(
        ctx.json({
          primary: `#459211`,
        })
      );
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/config/default_date_format"),
    async (_, res, ctx) => {
      return res(ctx.json("do MMM yyyy"));
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/config/system_settings"),
    async (_, res, ctx) => {
      return res(
        ctx.json({
          forceIntrospection: true,
          tokenValidityDurationInDays: 5,
        })
      );
    }
  ),
  rest.put(BASE_TEST_URL("/api/config/:key"), async (_, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.put(BASE_TEST_URL("/api/config/:key/:entity"), async (_, res, ctx) => {
    return res(ctx.status(201));
  }),
];
