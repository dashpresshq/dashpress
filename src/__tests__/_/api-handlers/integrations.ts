/* eslint-disable no-param-reassign */
import {
  DefaultBodyType,
  PathParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from "msw";
import { IKeyValue } from "shared/types/options";
import { BASE_TEST_URL } from "./_utils";

const CONSTANTS = [
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

const CREDENTIALS = [
  {
    value: "super-secret",
    key: "PAYMENT_API_KEY",
  },
  {
    value: "do-not-share",
    key: "MAIL_PASSWORD",
  },
  {
    value: "confidential",
    key: "ROOT_PASSWORD",
  },
];

const update =
  (DATA: IKeyValue[]) =>
  async (
    req: RestRequest<DefaultBodyType, PathParams<string>>,
    res: ResponseComposition<DefaultBodyType>,
    ctx: RestContext
  ) => {
    const key = req.params.key as string;
    const { value } = await req.json();

    const index = DATA.findIndex((constant) => constant.key === key);

    if (index > -1) {
      DATA[index] = { key, value };
    } else {
      DATA.push({ key, value });
    }
    return res(ctx.status(204));
  };

const delete$1 =
  (DATA: IKeyValue[]) =>
  async (
    req: RestRequest<DefaultBodyType, PathParams<string>>,
    res: ResponseComposition<DefaultBodyType>,
    ctx: RestContext
  ) => {
    const key = req.params.key as string;

    DATA.splice(
      DATA.findIndex((permission$1) => permission$1.key === key),
      1
    );

    return res(ctx.status(204));
  };

export const integrationsApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/integrations/constants"),
    async (_, res, ctx) => {
      return res(ctx.json(CONSTANTS));
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/integrations/credentials"),
    async (_, res, ctx) => {
      return res(
        ctx.json(
          CREDENTIALS.map((credential) => ({
            ...credential,
            value: "**********",
          }))
        )
      );
    }
  ),
  rest.post(
    BASE_TEST_URL("/api/integrations/credentials/reveal"),
    async (req, res, ctx) => {
      const { _password } = await req.json();
      if (_password === "password") {
        return res(ctx.json(CREDENTIALS));
      }
      return res(ctx.status(400), ctx.json({ message: "Invalid Password" }));
    }
  ),
  rest.put(
    BASE_TEST_URL("/api/integrations/constants/:key"),
    update(CONSTANTS)
  ),
  rest.put(
    BASE_TEST_URL("/api/integrations/credentials/:key"),
    update(CREDENTIALS)
  ),
  rest.delete(
    BASE_TEST_URL("/api/integrations/constants/:key"),
    delete$1(CONSTANTS)
  ),
  rest.delete(
    BASE_TEST_URL("/api/integrations/credentials/:key"),
    delete$1(CREDENTIALS)
  ),
];
