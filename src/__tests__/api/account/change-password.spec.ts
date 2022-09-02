import handler from "pages/api/account/change-password";
import signInHandler from "pages/api/auth/signin";
import { createMocks } from "node-mocks-http";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/account/change-password", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should not change password when incorrect", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "PATCH",
      body: {
        oldPassword: "invalid password",
        newPassword: "password-updated",
        reNewPassword: "password-updated",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);

    const signInRequest = createMocks({
      method: "POST",
      body: {
        username: "root",
        password: "password",
      },
    });

    await signInHandler(signInRequest.req, signInRequest.res);

    expect(signInRequest.res._getStatusCode()).toBe(201);
  });

  it("should change password when correct", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "PATCH",
      body: {
        oldPassword: "password",
        newPassword: "password-updated",
        reNewPassword: "password-updated",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const signInRequest = createMocks({
      method: "POST",
      body: {
        username: "root",
        password: "password-updated",
      },
    });

    await signInHandler(signInRequest.req, signInRequest.res);

    expect(signInRequest.res._getStatusCode()).toBe(201);
  });
});
