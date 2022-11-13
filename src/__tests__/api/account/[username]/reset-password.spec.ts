import handler from "pages/api/account/[username]/reset-password";
import signInHandler from "pages/api/auth/signin";
import { createMocks } from "node-mocks-http";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/account/[username]/reset-password", () => {
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

  it("should not reset user password on demo", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

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
        password: "password",
      },
    });

    await signInHandler(signInRequest.req, signInRequest.res);

    expect(signInRequest.res._getStatusCode()).toBe(201);
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
