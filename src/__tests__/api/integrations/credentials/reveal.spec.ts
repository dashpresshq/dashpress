import handler from "pages/api/integrations/credentials/reveal";
import {
  setupAllTestData,
  createAuthenticatedMocks,
  setupRolesTestData,
  createAuthenticatedCustomRoleMocks,
  setupUsersTestData,
} from "__tests__/api/_test-utils";

describe("/api/integrations/credentials/reveal", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials"]);
    await setupUsersTestData([
      {
        username: "custom-role",
        password:
          "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
        name: "Custom Role",
        role: "custom-role",
        systemProfile: "",
      },
    ]);
  });

  it("should not show reveal credentials when password is incorrect", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: ["CAN_MANAGE_INTEGRATIONS"],
      },
    ]);

    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        password: "invalid password",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Invalid Password",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should show reveal credentials only when password is correct", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: ["CAN_MANAGE_INTEGRATIONS"],
      },
    ]);

    const { req, res } = createAuthenticatedCustomRoleMocks({
      method: "POST",
      body: {
        _password: "password",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "key": "CREDENTIAL_KEY_1",
          "value": "CREDENTIAL_VALUE_1",
        },
        {
          "key": "CREDENTIAL_KEY_2",
          "value": "CREDENTIAL_VALUE_2",
        },
      ]
    `);
  });

  it("should show not reveal credentials when password is correct but invalid role", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: ["CAN_CONFIGURE_APP"],
      },
    ]);

    const { req, res } = createAuthenticatedCustomRoleMocks({
      method: "POST",
      body: {
        _password: "password",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Your account doesn't have enough priviledge to perform this action: (Can Manage Integrations)",
        "method": "POST",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 403,
      }
    `);
  });
});
