import { rest } from "msw";

const handlers = [
  rest.get("/login", async (req, res, ctx) => {
    const user = await users.login(JSON.parse(req.body));
    return res(ctx.json({ user }));
  }),
  rest.post("/checkout", async (req, res, ctx) => {
    const user = await users.login(JSON.parse(req.body));
    const isAuthorized = user.authorize(req.headers.Authorization);
    if (!isAuthorized) {
      return res(ctx.status(401), ctx.json({ message: "Not authorized" }));
    }
    const shoppingCart = JSON.parse(req.body);
    // do whatever other things you need to do with this shopping cart
    return res(ctx.json({ success: true }));
  }),
];

export { handlers };
