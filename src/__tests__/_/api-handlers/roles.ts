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

let PERMISSIONS = [
  "CAN_MANAGE_USERS",
  "CAN_RESET_PASSWORD",
  "CAN_MANAGE_PERMISSIONS",
  "CAN_MANAGE_ALL_ENTITIES",
  "CAN_ACCESS_ENTITY:ENTITY-2",
  "CAN_ACCESS_ENTITY:DISABLED-ENTITY-2",
];

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
    async (req, res, ctx) => {
      const { permission } = await req.json();
      PERMISSIONS.push(permission);
      return res(ctx.status(204));
    }
  ),
  rest.delete(
    BASE_TEST_URL("/api/roles/:roleId/permissions"),
    async (req, res, ctx) => {
      const { permission } = await req.json();
      PERMISSIONS = PERMISSIONS.filter(
        (permission$1) => permission$1 !== permission
      );
      return res(ctx.status(204));
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
