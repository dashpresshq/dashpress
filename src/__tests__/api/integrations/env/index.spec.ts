import handler from "pages/api/integrations/env";
import {
  setupAllTestData,
  createAuthenticatedViewerMocks,
  createAuthenticatedCustomRoleMocks,
  setupRolesTestData,
} from "__tests__/api/_test-utils";

describe("/api/integrations/env", () => {
  beforeAll(async () => {
    await setupAllTestData(["environment-variables"]);
  });

  it("should list only plain envs for users with CAN_CONFIGURE_APP role", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: ["CAN_CONFIGURE_APP"],
      },
    ]);

    const { req, res } = createAuthenticatedCustomRoleMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "key": "ENV_KEY_1",
          "value": "ENV_KEY_1",
        },
        {
          "key": "ENV_KEY_2",
          "value": "ENV_KEY_2",
        },
      ]
    `);
  });

  it("should not list constants for normal users", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Your account doesn't have enough priviledge to perform this action: (Can Configure App)",
        "method": "GET",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });
});
