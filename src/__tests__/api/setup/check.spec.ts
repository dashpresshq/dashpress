import { setupAllTestData } from "__tests__/setup-test-data";
import handler from "pages/api/setup/check";
import { createMocks } from "node-mocks-http";
import { setupCredentialsTestData } from "__tests__/setup-test-data/_credentials";
import { setupUsersTestData } from "__tests__/setup-test-data/_users";

describe("/api/setup/check", () => {
  beforeAll(async () => {
    await setupAllTestData();
  });

  it("should return true when the data exists and are valid", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      hasDbCredentials: true,
      hasUsers: true,
    });
  });

  it("should return false for hasDbCredentials when invalid", async () => {
    await setupCredentialsTestData({
      database: {
        port: "invalid value",
      },
    });

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      hasDbCredentials: false,
      hasUsers: true,
    });
  });

  it("should return false when data dont exist", async () => {
    await setupCredentialsTestData(false);
    await setupUsersTestData(false);

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      hasDbCredentials: false,
      hasUsers: false,
    });
  });
});
