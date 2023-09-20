import handler from "pages/api/account/mine";
import {
  createAuthenticatedCustomRoleMocks,
  createAuthenticatedMocks,
  setupAllTestData,
  setupUsersTestData,
} from "__tests__/api/_test-utils";

describe("/api/account/mine", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should get authenticated user profile", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "Root User",
        "permissions": [],
        "role": "creator",
        "systemProfile": "{"userId": "1"}",
        "username": "root",
      }
    `);
  });

  it("should update authenticated user profile", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PATCH",
      body: {
        name: "Updated Name",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(200);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "Updated Name",
        "permissions": [],
        "role": "creator",
        "systemProfile": "{"userId": "1"}",
        "username": "root",
      }
    `);
  });

  it("should return 401 when user doesn't exist", async () => {
    await setupUsersTestData(false);
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "NOT_AUTHENTICATED",
        "message": "root not found for 'users'",
        "method": "GET",
        "name": "UnauthorizedError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });

  it("should return 401 when role doesn't exist", async () => {
    await setupUsersTestData([
      {
        username: "custom-role",
        password:
          "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
        name: "Custom Role",
        role: "role-doesn't-exist",
        systemProfile: "",
      },
    ]);

    const { req, res } = createAuthenticatedCustomRoleMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "NOT_AUTHENTICATED",
        "message": "role-doesn't-exist not found for 'roles'",
        "method": "GET",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 403,
      }
    `);
  });
});
