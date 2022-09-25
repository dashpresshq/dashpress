import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

const CONFIG_KEY = {
  system_settings: {
    forceIntrospection: true,
    tokenValidityDurationInDays: 5,
  },
  default_date_format: "do MMM yyyy",
  theme_color: {
    primary: `#459211`,
  },
};

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
      return res(ctx.json(CONFIG_KEY.theme_color));
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/config/default_date_format"),
    async (_, res, ctx) => {
      return res(ctx.json(CONFIG_KEY.default_date_format));
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/config/system_settings"),
    async (_, res, ctx) => {
      return res(ctx.json(CONFIG_KEY.system_settings));
    }
  ),
  rest.put(BASE_TEST_URL("/api/config/:key"), async (req, res, ctx) => {
    CONFIG_KEY[req.params.key as string] = (await req.json()).data;
    return res(ctx.status(201));
  }),
  rest.put(BASE_TEST_URL("/api/config/:key/:entity"), async (_, res, ctx) => {
    return res(ctx.status(201));
  }),
];
