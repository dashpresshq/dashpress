import { rest } from "msw";

import { BASE_TEST_URL } from "./_utils";

export const SETUP_CHECK_DATA = {
  data: {
    hasUsers: true,
    hasDbCredentials: true,
  },
};

export const setupApiHandlers = [
  rest.get(BASE_TEST_URL("/api/setup/check"), async (_, res, ctx) => {
    return res(ctx.json(SETUP_CHECK_DATA.data));
  }),
  rest.post(BASE_TEST_URL("/api/setup/credentials"), async (req, res, ctx) => {
    const reqBody = JSON.stringify(await req.json());
    if (
      [
        `{"port":8080,"dataSourceType":"postgres","ssl":false,"host":"127.0.0.1","user":"root","password":"password","database":"dashpress"}`,
        `{"port":5432,"dataSourceType":"postgres","ssl":false,"connectionString":"some-connection-url"}`,
        `{"port":8080,"dataSourceType":"mysql","ssl":false,"host":"127.0.0.1","user":"root","password":"password","database":"dashpress"}`,
        `{"port":3306,"dataSourceType":"mysql","ssl":false,"connectionString":"some-connection-url"}`,
        `{"port":8080,"dataSourceType":"mssql","ssl":false,"host":"127.0.0.1","user":"root","password":"password","database":"dashpress"}`,
        `{"port":1433,"dataSourceType":"mssql","ssl":false,"connectionString":"some-connection-url"}`,
        `{"dataSourceType":"sqlite","filename":"some-sqlite-file-name"}`,
      ].includes(reqBody)
    ) {
      SETUP_CHECK_DATA.data.hasDbCredentials = true;
      return res(ctx.json({ success: true }));
    }
    return res(ctx.status(500));
  }),
  rest.post(BASE_TEST_URL("/api/setup/user"), async (req, res, ctx) => {
    if (
      JSON.stringify(await req.json()) ===
      `{"username":"testusername","name":"testname","password":"Some Password"}`
    ) {
      SETUP_CHECK_DATA.data.hasUsers = true;
      return res(ctx.json({ success: true, token: true }));
    }
    return res(ctx.status(500));
  }),
];
