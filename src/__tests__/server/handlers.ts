import { rest } from "msw";

const handlers = [
  rest.get("http://api.test.com/api/setup/check", async (_, res, ctx) => {
    return res(
      ctx.json({
        hasUsers: false,
        hasDbCredentials: false,
      })
    );
  }),
  rest.post("/api/setup/credentials", async (_, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.post("/api/setup/user", async (_, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];

export { handlers };
