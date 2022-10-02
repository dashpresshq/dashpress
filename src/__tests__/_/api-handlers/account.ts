import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

let ME = {
  name: "Root User",
  permissions: [],
  role: "creator",
  systemProfile: "{userId: 1}",
  username: "root",
};

let USERS = [
  {
    name: "User 1",
    username: "user-1",
    systemProfile: "user-1-system-profile",
    role: "role-1",
  },
  {
    name: "User 2",
    username: "user-2",
    systemProfile: "user-2-system-profile",
    role: "role-2",
  },
  {
    name: "User 3",
    username: "user-3",
    systemProfile: "user-3-system-profile",
    role: "role-3",
  },
];

export const accountApiHandlers = [
  rest.get(BASE_TEST_URL("/api/account"), async (_, res, ctx) => {
    return res(ctx.json(USERS));
  }),

  rest.get(BASE_TEST_URL("/api/account/mine"), async (_, res, ctx) => {
    return res(ctx.json(ME));
  }),

  rest.post(BASE_TEST_URL("/api/account"), async (req, res, ctx) => {
    if (
      JSON.stringify(await req.json()) ===
      `{"username":"someusername","name":"Some Name","role":"viewer","password":"Password"}`
    ) {
      return res(ctx.status(204));
    }
    return res(ctx.status(500));
  }),

  rest.patch(BASE_TEST_URL("/api/account/mine"), async (req, res, ctx) => {
    ME = { ...ME, ...(await req.json()) };
    return res(ctx.status(204));
  }),
  rest.delete(
    BASE_TEST_URL("/api/account/:username"),
    async (req, res, ctx) => {
      USERS = USERS.filter(({ username }) => username !== req.params.username);
      return res(ctx.status(204));
    }
  ),
  rest.patch(
    BASE_TEST_URL("/api/account/change-password"),
    async (req, res, ctx) => {
      if (
        JSON.stringify(await req.json()) ===
        `{"oldPassword":"Old Password","newPassword":"New Password","reNewPassword":"New Password"}`
      ) {
        return res(ctx.status(204));
      }
      return res(ctx.status(500));
    }
  ),
];
