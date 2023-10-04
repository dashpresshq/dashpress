import handler from "pages/api/versions";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

jest.mock("latest-version", () => jest.fn().mockReturnValue("9.9.9"));

jest.mock("process", () => ({ versions: { node: "16.9.9" } }));

jest.mock("../../../../package.json", () => ({ version: "0.0.0" }));

describe("/api/versions/index", () => {
  it("should show correct message for latest version", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "Cache Adapter": "memory (Kindly use 'redis' when running multiple instances)",
        "Config Adapter": "json-file (Kindly use 'database' when you have more than two users on the application)",
        "DashPress Version": "v0.0.0. Version v9.9.9 is now available.",
        "Node Version": "16.9.9",
      }
    `);
  });
});
