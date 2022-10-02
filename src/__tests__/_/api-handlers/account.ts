import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

let ME = {
  name: "Root User",
  permissions: [],
  role: "creator",
  systemProfile: "{userId: 1}",
  username: "root",
};

export const accountApiHandlers = [
  rest.get(BASE_TEST_URL("/api/account/mine"), async (_, res, ctx) => {
    return res(ctx.json(ME));
  }),
  rest.patch(BASE_TEST_URL("/api/account/mine"), async (req, res, ctx) => {
    ME = { ...ME, ...(await req.json()) };
    return res(ctx.status(204));
  }),
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
