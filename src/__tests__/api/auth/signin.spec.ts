import handler from "pages/api/auth/signin";
import { createMocks } from "node-mocks-http";
import { authTokenService } from "backend/lib/auth-token/auth-token.service";
import { setupAllTestData } from "__tests__/api/_test-utils";

describe("/api/auth/signin", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should sign in valid credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        username: "root",
        password: "password",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, iat, ...decodedToken } = await authTokenService.verify(
      res._getJSONData().token
    );

    expect(decodedToken).toMatchInlineSnapshot(`
      {
        "name": "Root User",
        "role": "creator",
        "systemProfile": "{"userId": "1"}",
        "username": "root",
      }
    `);
  });

  it("should not authenticate invalid username", async () => {
    const { req, res } = createMocks({
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
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });

  it("should not authenticate invalid password", async () => {
    const { req, res } = createMocks({
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
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });
});
