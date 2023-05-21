import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const versionApiHandlers = [
  rest.get(BASE_TEST_URL("/api/versions"), async (_, res, ctx) => {
    return res(ctx.json({ key1: "value1", key2: "value2", key3: "value3" }));
  }),
];
