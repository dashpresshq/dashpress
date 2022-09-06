import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const authApiHandlers = [
  rest.post(BASE_TEST_URL("/api/auth/signin"), async (req, res, ctx) => {
    const body = await req.json();
    if (body.username === "user" && body.password === "password") {
      return res(
        ctx.json({
          token: "some valid jwt token",
        })
      );
    }
    return res(
      ctx.status(401),
      ctx.json({
        message: "Invalid Login",
      })
    );
  }),
];
