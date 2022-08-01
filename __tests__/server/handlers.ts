import { rest } from "msw";

const handlers = [
  rest.get("http://localhost:3000/api/setup/check", async (req, res, ctx) => {
    return res(
      ctx.json({
        hasUsers: false,
        hasDbCredentials: false,
      })
    );
  }),
  rest.post("/api/setup/credentials", async (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.post("/api/setup/user", async (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];

export { handlers };
