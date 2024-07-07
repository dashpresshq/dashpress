import handler from "@/pages/api/integrations/credentials";
import {
  createAuthenticatedCustomRoleMocks,
  createAuthenticatedViewerMocks,
  setupAllTestData,
  setupRolesTestData,
} from "@/tests/api/setups";

describe("/api/integrations/credentials", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials"]);
  });

  it("should list only plain redacted credentials for users with CAN_CONFIGURE_APP role", async () => {
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
          "key": "CREDENTIAL_KEY_1",
          "value": "***********",
        },
        {
          "key": "CREDENTIAL_KEY_2",
          "value": "***********",
        },
      ]
    `);
  });

  it("should not list constants for normal users", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Your account doesn't have enough priviledge to perform this action: (Can Configure App)",
        "method": "GET",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 403,
      }
    `);
  });
});
