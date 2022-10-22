import { rest } from "msw";
import { IAuthenticatedUserBag } from "shared/types/user";
import { BASE_TEST_URL } from "./_utils";

let ME: IAuthenticatedUserBag = {
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

let USER = {
  name: "Some Name",
  username: "someuseranme",
  systemProfile: `{"foo": "bar"}`,
  role: "viewer",
};

export const accountApiHandlers = [
  rest.get(BASE_TEST_URL("/api/account"), async (_, res, ctx) => {
    return res(ctx.json(USERS));
  }),

  rest.get(BASE_TEST_URL("/api/account/mine"), async (_, res, ctx) => {
    return res(ctx.json(ME));
  }),

  rest.patch(BASE_TEST_URL("/api/account/mine"), async (req, res, ctx) => {
    ME = { ...ME, ...(await req.json()) };
    return res(ctx.status(204));
  }),

  rest.get(BASE_TEST_URL("/api/account/:username"), async (_, res, ctx) => {
    return res(ctx.json(USER));
  }),

  rest.patch(BASE_TEST_URL("/api/account/:username"), async (req, res, ctx) => {
    USER = {
      ...USER,
      ...(await req.json()),
    };
    return res(ctx.json(204));
  }),

  rest.patch(
    BASE_TEST_URL("/api/account/:username/reset-password"),
    async (req, res, ctx) => {
      if ((await req.json()).password === "password") {
        return res(ctx.status(204));
      }
      return res(ctx.status(500));
    }
  ),

  rest.post(BASE_TEST_URL("/api/account"), async (req, res, ctx) => {
    if (
      JSON.stringify(await req.json()) ===
      `{"username":"someusername","name":"Some Name","role":"viewer","password":"Password"}`
    ) {
      return res(ctx.status(204));
    }
    return res(ctx.status(500));
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
