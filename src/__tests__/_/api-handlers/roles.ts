import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

let ROLES = [
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
  {
    value: "role-2",
    label: "Role 2",
  },
];

const PERMISSIONS = ["CAN_EAT"];

export const rolesApiHandlers = [
  rest.get(BASE_TEST_URL("/api/roles"), async (_, res, ctx) => {
    return res(ctx.json(ROLES));
  }),
  rest.get(
    BASE_TEST_URL("/api/roles/:roleId/permissions"),
    async (_, res, ctx) => {
      return res(ctx.json(PERMISSIONS));
    }
  ),
  rest.post(
    BASE_TEST_URL("/api/roles/:roleId/permissions"),
    async (_, res, ctx) => {
      return res(ctx.json(PERMISSIONS));
    }
  ),
  rest.patch(
    BASE_TEST_URL("/api/roles/:roleId/permissions"),
    async (_, res, ctx) => {
      return res(ctx.json(PERMISSIONS));
    }
  ),
  rest.delete(BASE_TEST_URL("/api/roles/:roleId"), async (req, res, ctx) => {
    ROLES = ROLES.filter(({ value }) => value !== req.params.roleId);
    return res(ctx.status(204));
  }),
  rest.post(BASE_TEST_URL("/api/roles"), async (req, res, ctx) => {
    if (JSON.stringify(await req.json()) === `{"name":"Some New Role"}`) {
      return res(ctx.status(204));
    }
    return res(ctx.status(500));
  }),
];
