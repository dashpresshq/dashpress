import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const accountApiHandlers = [
  rest.get(BASE_TEST_URL("/api/account/mine"), async (_, res, ctx) => {
    return res(
      ctx.json({
        name: "Root User",
        permissions: [],
        role: "creator",
        systemProfile: "{userId: 1}",
        username: "root",
      })
    );
  }),
];
