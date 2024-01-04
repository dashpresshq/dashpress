import handler from "pages/api/account/change-password";
import signInHandler from "pages/api/auth/signin";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { createUnAuthenticatedMocks } from "../_test-utils/_authenticatedMock";

describe("/api/account/change-password", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

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

    const signInRequest = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        username: "root",
        password: "password",
      },
    });

    await signInHandler(signInRequest.req, signInRequest.res);

    expect(signInRequest.res._getStatusCode()).toBe(201);
  });

  it("should not change password on demo account", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

    const { req, res } = createAuthenticatedMocks({
      method: "PATCH",
      body: {
        oldPassword: "password",
        newPassword: "password-updated",
        reNewPassword: "password-updated",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);

    const signInRequest = createUnAuthenticatedMocks({
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

    const signInRequest = createUnAuthenticatedMocks({
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
