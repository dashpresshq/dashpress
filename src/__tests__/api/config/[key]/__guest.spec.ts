import { createMocks } from "node-mocks-http";
import handler from "pages/api/config/[key]/__guest";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/config/[key]/__guest", () => {
  beforeAll(async () => {
    await setupAllTestData(["app-config", "schema"]);
  });

  it("should get guest fields for authenticated users", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "theme_color",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      primary: "#4b38b3",
    });
  });

  it("should get guest fields for non-authenticated users", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "theme_color",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      primary: "#4b38b3",
    });
  });

  it("should return 400 for when access non guest field", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "default_date_format",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Invalid guest config key default_date_format",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
