import { setupAllTestData } from "__tests__/api/_test-utils";
import { authTokenApiService } from "backend/lib/auth-token/auth-token.service";
import handler from "pages/api/auth/signin";

import { createUnAuthenticatedMocks } from "../_test-utils/_authenticatedMock";

describe("/api/auth/signin", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should sign in valid credentials", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        username: "root",
        password: "password",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);

    expect(await authTokenApiService.verify(res._getJSONData().token))
      .toMatchInlineSnapshot(`
      {
        "name": "Root User",
        "role": "creator",
        "username": "root",
      }
    `);
  });

  it("should not authenticate invalid username", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        username: "invalid username",
        password: "password",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Invalid Login",
        "method": "POST",
        "name": "UnauthorizedError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });

  it("should not authenticate invalid password", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        username: "root",
        password: "invalid password",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Invalid Login",
        "method": "POST",
        "name": "UnauthorizedError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });
});
