import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

export const rolesApiHandlers = [
  rest.get(BASE_TEST_URL("/api/roles"), async (_, res, ctx) => {
    return res(
      ctx.json([
        {
          value: "creator",
          label: "Creator",
        },
        {
          value: "viewer",
          label: "Viewer",
        },
        {
          value: "role-1",
          label: "Role 1",
        },
      ])
    );
  }),
];
