import handler from "pages/api/setup/user";
import { createMocks } from "node-mocks-http";
import { authTokenService } from "backend/lib/auth-token/auth-token.service";
import { setupUsersTestData } from "__tests__/api/_test-utils";

describe("/api/setup/user", () => {
  beforeAll(async () => {
    await setupUsersTestData(false);
  });

  it("should set up first user successfully", async () => {
    const postRequest = createMocks({
      method: "POST",
      body: {
        username: "newsetupuser",
        name: "New Setup User",
        password: "password",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(201);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, iat, ...decodedToken } = await authTokenService.verify(
      postRequest.res._getJSONData().token
    );

    expect(decodedToken).toMatchInlineSnapshot(`
      Object {
        "name": "New Setup User",
        "role": "creator",
        "username": "newsetupuser",
      }
    `);
  });

  it("should block request if users already exists", async () => {
    const postRequest = createMocks({
      method: "POST",
      body: {
        username: "anothernewsetupuser",
        name: "New Setup User",
        password: "password",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(400);

    expect(postRequest.res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Primary user already setup",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
