import handler from "pages/api/versions";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

jest.mock("latest-version", () => jest.fn().mockReturnValue("9.9.9"));

jest.mock("process", () => ({ versions: { node: "16.9.9" } }));

jest.mock("../../../../package.json", () => ({ version: "9.9.9" }));

describe("/api/versions/index", () => {
  it("should show correct message for latest version", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "Cache Adapter": "memory (When running multiple instances, kindly use 'redis' for a better experience)",
        "Config Adapter": "json-file (Kindly use 'database' for a better experience. Any bug reported with this adaptor will be automatically closed)",
        "Hadmean Version": "v9.9.9(Latest Version)",
        "Node Version": "16.9.9",
      }
    `);
  });
});
