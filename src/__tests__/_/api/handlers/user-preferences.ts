import { rest } from "msw";

import { BASE_TEST_URL } from "./_utils";

const USER_PREFERENCES = {
  theme: "dark",
};

export const userPreferencesApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/user-preferences/:key"),
    async (req, res, ctx) => {
      return res(
        ctx.json({ data: USER_PREFERENCES[req.params.key as string] })
      );
    }
  ),
  rest.put(
    BASE_TEST_URL("/api/user-preferences/:key"),
    async (req, res, ctx) => {
      USER_PREFERENCES[req.params.key as string] = (await req.json()).data;
      return res(ctx.status(201));
    }
  ),
];
