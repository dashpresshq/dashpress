import handler from "pages/api/integrations/env";
import {
  setupAllTestData,
  createAuthenticatedViewerMocks,
} from "__tests__/api/_test-utils";

describe("/api/integrations/env", () => {
  beforeAll(async () => {
    await setupAllTestData(["environment-variables"]);
  });

  it("should list envs for all users", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "ENV_KEY_1": "ENV_KEY_1",
        "ENV_KEY_2": "ENV_KEY_2",
        "GROUP_ENV___KEY_3": "ENV_KEY_3",
        "GROUP_ENV___KEY_4": "ENV_KEY_4",
      }
    `);
  });
});
