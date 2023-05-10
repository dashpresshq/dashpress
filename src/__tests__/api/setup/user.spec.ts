import handler from "pages/api/setup/user";
import { authTokenApiService } from "backend/lib/auth-token/auth-token.service";
import { setupUsersTestData } from "__tests__/api/_test-utils";
import { createUnAuthenticatedMocks } from "../_test-utils/_authenticatedMock";

describe("/api/setup/user", () => {
  beforeAll(async () => {
    await setupUsersTestData(false);
  });

  it("should set up first user successfully", async () => {
    const postRequest = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        username: "newsetupuser",
        name: "New Setup User",
        password: "password",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(201);

    expect(
      await authTokenApiService.verify(postRequest.res._getJSONData().token)
    ).toMatchInlineSnapshot(`
      {
        "name": "New Setup User",
        "role": "creator",
        "username": "newsetupuser",
      }
    `);
  });

  it("should block request if users already exists", async () => {
    const postRequest = createUnAuthenticatedMocks({
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
      {
        "message": "Primary user already setup",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
