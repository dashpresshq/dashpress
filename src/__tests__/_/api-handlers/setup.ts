import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const setupApiHandlers = [
  rest.get(BASE_TEST_URL("/api/setup/check"), async (_, res, ctx) => {
    return res(
      ctx.json({
        hasUsers: true,
        hasDbCredentials: true,
      })
    );
  }),
  rest.post(BASE_TEST_URL("/api/setup/credentials"), async (_, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.post(BASE_TEST_URL("/api/setup/user"), async (req, res, ctx) => {
    if (
      JSON.stringify(await req.json()) ===
      `{"username":"testusername","name":"testname","password":"Some Password"}`
    ) {
      return res(ctx.json({ success: true, token: true }));
    }
    return res(ctx.status(500));
  }),
];
