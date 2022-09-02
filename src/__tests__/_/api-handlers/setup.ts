import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const setupHandlers = [
  rest.get(BASE_TEST_URL("/api/setup/check"), async (_, res, ctx) => {
    return res(
      ctx.json({
        hasUsers: false,
        hasDbCredentials: false,
      })
    );
  }),
  rest.post(BASE_TEST_URL("/api/setup/credentials"), async (_, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.post(BASE_TEST_URL("/api/setup/user"), async (_, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];
