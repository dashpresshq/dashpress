import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

let CONSTANTS = [
  {
    value: "http://base.com",
    key: "BASE_URL",
  },
  {
    value: "foo constant value",
    key: "FOO_CONSTANT_KEY",
  },
  {
    value: "bar constant value",
    key: "BAR_CONSTANT_KEY",
  },
];

export const integrationsApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/integrations/constants"),
    async (_, res, ctx) => {
      return res(ctx.json(CONSTANTS));
    }
  ),
  rest.put(
    BASE_TEST_URL("/api/integrations/constants/:key"),
    async (req, res, ctx) => {
      const key = req.params.key as string;
      const { value } = await req.json();

      const index = CONSTANTS.findIndex((constant) => constant.key === key);

      if (index > -1) {
        CONSTANTS[index] = { key, value };
      } else {
        CONSTANTS.push({ key, value });
      }

      return res(ctx.json(204));
    }
  ),
  rest.delete(
    BASE_TEST_URL("/api/integrations/constants/:key"),
    async (req, res, ctx) => {
      const key = req.params.key as string;

      CONSTANTS = CONSTANTS.filter((permission$1) => permission$1.key !== key);
      return res(ctx.json(204));
    }
  ),
];
