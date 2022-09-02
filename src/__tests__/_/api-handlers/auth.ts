import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const authApiHandlers = [
  rest.post(BASE_TEST_URL("/api/auth/signin"), async (_, res, ctx) => {
    return res(
      ctx.json({
        token: "some valid jwt token",
      })
    );
  }),
];
