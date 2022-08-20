import { setupAllTestData } from "__tests__/setup-test-data";
import handler from "pages/api/account/[username]/reset-password";
import signInHandler from "pages/api/auth/signin";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { createMocks } from "node-mocks-http";

describe("/api/account/[username]/reset-password", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should reset user password", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        username: "root",
      },
      body: {
        password: "new-password",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const signInRequest = createMocks({
      method: "POST",
      body: {
        username: "root",
        password: "new-password",
      },
    });

    await signInHandler(signInRequest.req, signInRequest.res);

    expect(signInRequest.res._getStatusCode()).toBe(201);
  });
});
