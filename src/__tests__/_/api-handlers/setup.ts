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
  rest.post(BASE_TEST_URL("/api/setup/credentials"), async (req, res, ctx) => {
    const reqBody = JSON.stringify(await req.json());
    if (
      [
        `{"port":8080,"dataSourceType":"postgres","host":"127.0.0.1","user":"root","password":"password","database":"hadmean"}`,
        `{"port":5432,"dataSourceType":"postgres","connectionString":"some-connection-url"}`,
        `{"dataSourceType":"sqlite","filename":"some-sqlite-file-name"}`,
      ].includes(reqBody)
    ) {
      return res(ctx.json({ success: true }));
    }
    return res(ctx.status(500));
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
